"""
mysql/connector/__init__.py — Browser-compatible mysql.connector mock.

Routes SQL queries through the PHP proxy at /api/mysql_proxy.php using
a synchronous XMLHttpRequest so cursor.execute() behaves synchronously,
just like the real mysql.connector library.

Students write exactly the same code as they would with real mysql.connector:

    import mysql.connector
    conn = mysql.connector.connect(
        host='localhost', user='root', password='', database='mydb'
    )
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM students WHERE id = %s", (1,))
    for row in cursor.fetchall():
        print(row)
    conn.close()

The PHP proxy must be running and accessible at /api/mysql_proxy.php.

License: Creative Commons BY-NC-SA 4.0 — Simon Rundell
"""
import json
from urllib.parse import urlencode
from js import XMLHttpRequest

_PROXY_URL = '/api/mysql_proxy.php'


class Error(Exception):
    """Raised when a database operation fails."""
    pass


class DatabaseError(Error):
    pass


class OperationalError(DatabaseError):
    pass


def _post(payload: dict) -> dict:
    """Send a synchronous POST to the PHP proxy and return parsed JSON."""
    xhr = XMLHttpRequest.new()
    xhr.open('POST', _PROXY_URL, False)   # False = synchronous
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhr.send(urlencode(payload))
    try:
        return json.loads(xhr.responseText)
    except json.JSONDecodeError:
        raise OperationalError(f'Proxy returned invalid JSON: {xhr.responseText[:200]}')


class Cursor:
    """Database cursor that executes queries via the PHP proxy."""

    def __init__(self, conn, dictionary=False):
        self._conn = conn
        self._dictionary = dictionary
        self._rows = []
        self.description = None
        self.lastrowid = None
        self.rowcount = -1

    def execute(self, query, params=None):
        """Execute a single SQL statement."""
        result = _post({
            'host':     self._conn._host,
            'user':     self._conn._user,
            'password': self._conn._password,
            'database': self._conn._database,
            'query':    query,
            'params':   json.dumps(list(params)) if params else '',
        })
        if not result.get('success'):
            raise OperationalError(result.get('error', 'Unknown database error'))

        self._rows = result.get('data', [])
        self.rowcount = result.get('rowcount', len(self._rows))
        self.lastrowid = result.get('lastrowid')
        if self._rows:
            self.description = [(k, None, None, None, None, None, None)
                                 for k in self._rows[0].keys()]
        else:
            self.description = None

    def executemany(self, query, seq_of_params):
        """Execute a query for each item in seq_of_params."""
        for params in seq_of_params:
            self.execute(query, params)

    def fetchall(self):
        """Return all remaining rows."""
        rows, self._rows = self._rows, []
        if self._dictionary:
            return rows
        return [tuple(row.values()) for row in rows]

    def fetchone(self):
        """Return the next row or None."""
        if not self._rows:
            return None
        row = self._rows.pop(0)
        return row if self._dictionary else tuple(row.values())

    def fetchmany(self, size=1):
        """Return the next size rows."""
        chunk, self._rows = self._rows[:size], self._rows[size:]
        if self._dictionary:
            return chunk
        return [tuple(row.values()) for row in chunk]

    def close(self):
        self._rows = []

    def __enter__(self):
        return self

    def __exit__(self, *_):
        self.close()


class Connection:
    """Represents a connection to the MySQL database via the PHP proxy."""

    def __init__(self, host='localhost', user='root', password='',
                 database='', port=3306, **kwargs):
        self._host = host
        self._user = user
        self._password = password
        self._database = database

    def cursor(self, dictionary=False, **kwargs):
        return Cursor(self, dictionary=dictionary)

    def commit(self):
        """No-op — each proxy request is auto-committed."""
        pass

    def rollback(self):
        raise NotImplementedError('Transactions are not supported via the proxy.')

    def close(self):
        pass

    def __enter__(self):
        return self

    def __exit__(self, *_):
        self.close()


def connect(host='localhost', user='root', password='',
            database='', port=3306, **kwargs) -> Connection:
    """Create and return a Connection object."""
    return Connection(host=host, user=user, password=password,
                      database=database, port=port)
