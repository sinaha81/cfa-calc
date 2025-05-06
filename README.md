# Advanced Risk & Return Analyzer

![ site ]((https://sinaha81.github.io/cfa-calc/))

A user-friendly desktop application built with Python, CustomTkinter, and Matplotlib for analyzing the risk and performance metrics of a financial return series. It supports both English and Persian languages and features a modern dark theme for visualizations.

![App Screenshot](https://github.com/sinaha81/cfa-calc/blob/main/image.png)
*(Replace placeholder.png with an actual screenshot of your application)*

## Features

*   **Data Input:**
    *   Manually enter single or multiple return values (as percentages, separated by comma, space, or newline).
    *   Import return data directly from CSV or Excel files (reads the first numeric column).
*   **Data Management:**
    *   View the current list of data points.
    *   Select, edit, or delete individual data points.
    *   Clear the entire data list.
    *   Export the current data list to an Excel file (`.xlsx`).
*   **Risk & Performance Metrics Calculation:**
    *   Number of Data Points
    *   Arithmetic Mean
    *   95% Confidence Interval for the Mean (t-distribution)
    *   Geometric Mean (Compound Annual Growth Rate - CAGR)
    *   Standard Deviation (Risk)
    *   Downside Deviation (Target = 0)
    *   Variance
    *   Coefficient of Variation (CV)
    *   Maximum Drawdown (MDD)
    *   MDD Period (Duration in steps)
    *   Skewness
    *   Excess Kurtosis (Kurtosis - 3)
    *   Normality Test (Shapiro-Wilk: W-statistic and p-value)
    *   Historical Value at Risk (VaR) 5% (5th percentile)
    *   Historical Gain 95% (95th percentile)
    *   Maximum Single Period Gain
    *   Sharpe Ratio (requires Risk-Free Rate)
    *   Sortino Ratio (requires Risk-Free Rate)
*   **Configuration:**
    *   Set the annual Risk-Free Rate (%) for Sharpe and Sortino calculations.
*   **Visualization (with Dark Theme):**
    *   **Histogram:** Displays return distribution with optional KDE (Kernel Density Estimate) and Normal distribution overlay. Highlights VaR 5% and Gain 95% tails. Shows Mean and Median lines.
    *   **Box Plot:** Visualizes return quartiles, median, mean, and outliers. Includes individual data points overlay (stripplot).
    *   **Equity Curve:** Shows cumulative growth of an initial investment (e.g., 1000 units) based on the return series.
    *   **Quantile-Quantile (QQ) Plot:** Compares the quantiles of the return data against a theoretical Normal distribution to visually assess normality.
*   **Output & Export:**
    *   Display calculated metrics clearly in the GUI.
    *   Export all calculated results, including input parameters and the data list, to a text file (`.txt`).
*   **User Interface:**
    *   Modern look and feel using CustomTkinter.
    *   Supports **English** and **Persian (Farsi)** languages (switchable via dropdown).
    *   Handles Right-to-Left (RTL) display for Persian.
    *   Informative tooltips for each calculated metric.
    *   Status bar for user feedback.
    *   Dark theme applied consistently, including plots.

## Requirements

*   Python 3.8+
*   Libraries:
    *   `customtkinter`
    *   `numpy`
    *   `pandas`
    *   `matplotlib`
    *   `seaborn`
    *   `scipy`
    *   `arabic_reshaper` (for proper Persian text display in plots)
    *   `python-bidi` (for proper Persian text display in plots)
    *   `openpyxl` (for reading `.xlsx` files)

*   **Font:** For optimal display in Persian, it's highly recommended to have the **Vazir** or **Vazirmatn** font installed on your system. The application attempts to use fallbacks if not found.

## Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/your-repository-name.git
    cd your-repository-name
    ```
2.  **Create a virtual environment (Recommended):**
    ```bash
    python -m venv venv
    # Activate the environment (Windows)
    .\venv\Scripts\activate
    # Activate the environment (macOS/Linux)
    source venv/bin/activate
    ```
3.  **Install the required libraries:**
    ```bash
    pip install customtkinter numpy pandas matplotlib seaborn scipy arabic_reshaper python-bidi openpyxl
    ```
    *(Alternatively, if you create a `requirements.txt` file, users can just run `pip install -r requirements.txt`)*

## Usage

1.  Run the main Python script:
    ```bash
    python your_script_name.py
    ```
    *(Replace `your_script_name.py` with the actual name of your script, e.g., `analyzer_app.py`)*

2.  **Add Data:**
    *   Enter return percentages in the "Add New Data" box. You can enter multiple values separated by commas, spaces, or newlines. Press Enter or click "Add".
    *   Alternatively, click "Import Data (CSV/Excel)" to load data from a file. Ensure the file contains a single column of numeric returns.
3.  **Manage Data (Optional):**
    *   Use the dropdown in the "Edit / Delete Data" section to select a data point.
    *   Enter a new value and click "Save" to edit, or click "Delete" to remove the selected point.
    *   Click "Clear Entire List" to remove all data.
4.  **Set Risk-Free Rate:**
    *   Enter the annualized risk-free rate (e.g., `2.5` for 2.5%) in the "Risk-Free Rate" input box. This is used for Sharpe and Sortino ratios.
5.  **Calculate Metrics:**
    *   Click the "Calculate Metrics" button. The results will appear in the left panel.
6.  **Visualize Data:**
    *   Click the plot buttons ("Plot Histogram", "Plot Box Plot", etc.) to generate visualizations in separate windows. At least 1 data point is needed for plots, more for meaningful results.
7.  **Export:**
    *   Click "Save Results to Text File" to save the calculated metrics.
    *   Click "Save Data to Excel" to save the current data list.
8.  **Change Language:**
    *   Use the top-left dropdown menu to switch between English and Persian.

## Data Input File Format

*   When importing from CSV or Excel:
    *   The application expects data in a **single column**.
    *   It will attempt to read the **first column containing primarily numeric data**.
    *   Headers are ignored (it assumes no header or reads `header=None`).
    *   Values should represent **percentage returns** (e.g., `1.5`, `-0.8`, `2.0`).
    *   Any non-numeric values within the selected column will be ignored during import.

## Future Enhancements (Ideas)

*   Implement benchmark analysis (Alpha, Beta, R-squared, Tracking Error, Information Ratio).
*   Add more normality tests (e.g., Jarque-Bera).
*   Implement autocorrelation tests (e.g., Ljung-Box) and ACF/PACF plots.
*   Calculate and visualize rolling metrics (e.g., rolling Sharpe, rolling Volatility).
*   Add more VaR/ES calculation methods (Parametric Normal, Parametric t, Cornish-Fisher).
*   Allow specifying data frequency (Daily, Monthly, etc.) for accurate annualization.

## Contributing

Contributions are welcome! If you'd like to contribute:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

Please report any bugs or suggest features using the GitHub Issues tab.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. *(You need to create a file named `LICENSE` and put the MIT License text in it)*
