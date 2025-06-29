# Advanced Risk & Return Analyzer

(https://sinaha81.github.io/cfa-calc/)


![App Screenshot](https://github.com/sinaha81/cfa-calc/blob/main/image.png)


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

