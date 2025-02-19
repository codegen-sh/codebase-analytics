# Software Metrics Analysis Guide

This guide explains the various software metrics calculated by the codebase analysis tool, including their meanings, formulas, and implementation details using the codegen library.

## Line Metrics

### Lines of Code (LOC)
- **Definition**: Total number of lines in the source code, including blank lines and comments
- **Calculation**: Simple count of all lines in the source file
- **Implementation**: Uses line splitting and counting in the `count_lines()` function

### Logical Lines of Code (LLOC)
- **Definition**: Number of actual statements in the code
- **Implementation Details**:
  - Counts semicolon-separated statements
  - Handles continued lines (those ending with \, ,, {, [, ()
  - Excludes comments and blank lines
  - Calculated in `count_lines()` function

### Source Lines of Code (SLOC)
- **Definition**: Number of lines containing actual code (excluding blank lines)
- **Implementation**: Counts non-empty lines after stripping whitespace

### Comment Density
- **Formula**: `(total_comments / total_loc) * 100`
- **Purpose**: Measures the proportion of comments in the codebase
- **Implementation**: Calculated after gathering line metrics in the `analyze_repo` endpoint

## Complexity Metrics

### Cyclomatic Complexity
- **Definition**: Measures the number of linearly independent paths through the code
- **Calculation Method**:
  - Base complexity of 1
  - +1 for each:
    - if statement
    - elif statement
    - for loop
    - while loop
  - +1 for each boolean operator (and, or) in conditions
  - +1 for each except block in try-catch statements
- **Implementation**: `calculate_cyclomatic_complexity()` function traverses AST using codegen's statement types
- **Ranking Scale**:
  ```
  A: 1-5 (Low complexity)
  B: 6-10 (Moderate complexity)
  C: 11-20 (High complexity)
  D: 21-30 (Very high complexity)
  E: 31-40 (Extremely high complexity)
  F: 41+ (Unmanageable complexity)
  ```

### Halstead Metrics
- **Components**:
  - n1: Number of unique operators
  - n2: Number of unique operands
  - N1: Total operators
  - N2: Total operands
- **Volume Formula**: `V = (N1 + N2) * log2(n1 + n2)`
- **Implementation Details**:
  - Uses codegen's expression types (BinaryExpression, UnaryExpression, ComparisonExpression)
  - Extracts operators and operands from the AST
  - Calculated in `calculate_halstead_volume()` function

### Depth of Inheritance (DOI)
- **Definition**: Measures the length of inheritance chain for each class
- **Calculation**: Length of superclasses list for each class
- **Implementation**: Simple calculation using codegen's class information in `calculate_doi()`

## Maintainability Index
- **Definition**: A composite metric indicating how maintainable the code is
- **Formula**: 
  ```
  MI = 171 - 5.2 * ln(HV) - 0.23 * CC - 16.2 * ln(SLOC)
  Normalized = max(0, min(100, MI * 100 / 171))
  ```
  Where:
  - HV: Halstead Volume
  - CC: Cyclomatic Complexity
  - SLOC: Source Lines of Code
- **Implementation**: Calculated in `calculate_maintainability_index()`
- **Ranking Scale**:
  ```
  A: 85-100 (Highly maintainable)
  B: 65-84 (Moderately maintainable)
  C: 45-64 (Somewhat maintainable)
  D: 25-44 (Not very maintainable)
  F: 0-24 (Unmaintainable)
  ```

## Repository Metrics

### Commit Activity
- **Scope**: Last 12 months of repository activity
- **Implementation Details**:
  - Uses git commands through subprocess
  - Aggregates commits by month
  - Returns a dictionary with month-year keys and commit counts as values

### General Statistics
- Number of files (by extension)
- Number of functions
- Number of classes
- Repository description (fetched from GitHub API)

## Using the Analysis Tool

The tool is implemented as a FastAPI application wrapped in a Modal deployment. To analyze a repository:

1. Send a POST request to `/analyze_repo` with the repository URL
2. The tool will:
   - Clone the repository
   - Parse the codebase using codegen
   - Calculate all metrics
   - Return a comprehensive JSON response with all metrics

The analysis combines static code analysis (using codegen's AST parsing) with git history analysis to provide a complete picture of the codebase's health and maintainability.
