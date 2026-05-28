# Test script: NetworkX
# Install NetworkX from the Packages button before running.
# Expected output: graph analysis in the Console + network diagram in Graphics.
# Note: rendering requires Matplotlib — install both.

import networkx as nx
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches

print("=" * 40)
print(f"  NetworkX {nx.__version__} — functionality test")
print("=" * 40)

# --- Build a social network ---
G = nx.Graph()
G.add_nodes_from(['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace'])
G.add_edges_from([
    ('Alice',   'Bob'),
    ('Alice',   'Charlie'),
    ('Alice',   'Diana'),
    ('Bob',     'Eve'),
    ('Bob',     'Frank'),
    ('Charlie', 'Diana'),
    ('Diana',   'Eve'),
    ('Eve',     'Grace'),
    ('Frank',   'Grace'),
])

print(f"\nGraph: {G.number_of_nodes()} nodes, {G.number_of_edges()} edges")
print(f"  Connected:  {nx.is_connected(G)}")
print(f"  Diameter:   {nx.diameter(G)}")
print(f"  Avg degree: {sum(d for _, d in G.degree()) / G.number_of_nodes():.2f}")

# --- Centrality ---
degree_cent = nx.degree_centrality(G)
between_cent = nx.betweenness_centrality(G)
print("\nCentrality (degree / betweenness):")
for node in sorted(G.nodes):
    print(f"  {node:<10} deg={degree_cent[node]:.3f}  "
          f"between={between_cent[node]:.3f}")

# --- Shortest paths ---
print("\nShortest paths from Alice:")
for target in ['Eve', 'Grace', 'Frank']:
    path = nx.shortest_path(G, 'Alice', target)
    print(f"  → {target}: {' → '.join(path)}")

# --- Draw ---
fig, ax = plt.subplots(figsize=(7, 5))
ax.set_title('NetworkX — Social Network', fontweight='bold')
pos = nx.spring_layout(G, seed=7)
node_sizes = [1200 + 2000 * degree_cent[n] for n in G.nodes]
nx.draw_networkx(G, pos, ax=ax,
                 node_color='steelblue', node_size=node_sizes,
                 font_color='white', font_size=8, font_weight='bold',
                 edge_color='#aaaaaa', width=2)
ax.axis('off')
plt.tight_layout()
plt.show()

print("\n✓ NetworkX test complete — check the Graphics tab.")
