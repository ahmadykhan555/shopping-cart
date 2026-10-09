# Quantity requirements

- Quantity updates must produce finite integers.
- Values below the configured minimum become the minimum.
- Values above the configured maximum become the maximum.
- Non-finite values become the minimum.
- Fractional values are rounded down before applying bounds.

Review the supplied proposed change to the shared quantity helper. The context
contains the proposed new source, not the old implementation. Source locations
in findings refer to this proposed source.
