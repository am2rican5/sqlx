# SQLX

Syntax highlighting for SQLX files in VS Code. SQLX is a BigQuery SQL extension language used with [Dataform](https://dataform.co/) for data transformation pipelines.

## Features

- **Full syntax highlighting** for `.sqlx` files
- **Multi-block support**:
  - `config { }` - Define metadata, dependencies, and BigQuery settings
  - `js { }` - Write JavaScript for dynamic query generation
  - `pre_operations { }` - SQL to execute before the main query
  - `post_operations { }` - SQL to execute after the main query
- **SQLX-specific functions**: `ref()`, `self()`, `resolve()`, `when()`, `incremental()`, and more
- **JavaScript interpolation**: `${...}` expressions for dynamic SQL
- **100+ SQL functions**: Including BigQuery-specific functions like `APPROX_COUNT_DISTINCT`, `FARM_FINGERPRINT`, and geospatial functions
- **Comprehensive config properties**: type, schema, dependencies, partitionBy, clusterBy, assertions, and more

## Supported Syntax

### Blocks
- Config blocks with JSON-like property definitions
- JavaScript blocks with full JS syntax highlighting
- Pre/post operation blocks for SQL execution hooks
- Main SQL body with complete SQL syntax support

### SQL Features
- DML: SELECT, INSERT, UPDATE, DELETE, MERGE
- DDL: CREATE, ALTER, DROP (TABLE, VIEW, SCHEMA)
- Clauses: FROM, WHERE, JOIN, GROUP BY, HAVING, ORDER BY, WITH (CTEs)
- Window functions: OVER, PARTITION BY, ROWS, RANGE
- All standard and BigQuery-specific data types

### Comments
- Line comments: `//` and `--`
- Block comments: `/* */`

## Installation

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
3. Search for "SQLX"
4. Click Install

## Usage

Simply open any `.sqlx` file and syntax highlighting will be applied automatically.

## Requirements

- VS Code 1.108.0 or later

## Resources

- [Dataform Documentation](https://docs.dataform.co/)
- [SQLX Language Reference](https://docs.dataform.co/reference/sqlx)
- [Dataform GitHub](https://github.com/dataform-co/dataform)

## Release Notes

### 1.0.0

Initial release with full SQLX syntax highlighting support.

## License

MIT
