# Test script: ssl
# Install SSL from the Packages button before running.
# Expected output: TLS context info printed to the Console.
#
# NOTE: this only exercises the ssl module itself (contexts, protocols,
# certificate loading). Opening a real network socket is not possible
# from the browser sandbox, so there is no live connection here.

import ssl

print("=" * 40)
print("  ssl — functionality test")
print("=" * 40)

print(f"\nOpenSSL version: {ssl.OPENSSL_VERSION}")

ctx = ssl.create_default_context()
print(f"\nDefault context created: {ctx}")
print(f"  Minimum TLS version: {ctx.minimum_version}")
print(f"  Check hostname:      {ctx.check_hostname}")
print(f"  Verify mode:         {ctx.verify_mode}")

print("\n[ Available protocol constants ]")
for name in ('TLS_CLIENT', 'TLS_SERVER'):
    print(f"  ssl.{name} = {getattr(ssl.PROTOCOL_TLS_CLIENT if name == 'TLS_CLIENT' else ssl.PROTOCOL_TLS_SERVER, 'value', 'n/a')}")

print("\n✓ ssl test complete.")
