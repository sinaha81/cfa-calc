# -*- coding: utf-8 -*-
import customtkinter as ctk
import numpy as np
import pandas as pd
from tkinter import messagebox, Toplevel, filedialog
import tkinter as tk
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg, NavigationToolbar2Tk
from matplotlib.figure import Figure
import matplotlib.pyplot as plt
import seaborn as sns
from scipy.stats import skew, kurtosis, gmean, t, norm, shapiro, probplot
import re
import os
import platform
import sys
import math
import warnings
import arabic_reshaper
from bidi.algorithm import get_display

warnings.filterwarnings("ignore", message="Matplotlib is building the font cache", category=UserWarning)

# --- تنظیمات اولیه ---
ctk.set_appearance_mode("Dark") # <- تضمین تم تاریک برای خود اپلیکیشن
ctk.set_default_color_theme("blue")

# --- تعریف رنگ‌های تم تیره حرفه‌ای برای نمودار ---
DARK_BACKGROUND_COLOR = '#2b2b2b' # یک خاکستری تیره خوب
DARK_AXES_COLOR = '#3c3f41'     # کمی روشن‌تر برای ناحیه رسم
DARK_TEXT_COLOR = '#cccccc'     # خاکستری خیلی روشن برای متن
DARK_GRID_COLOR = '#555555'     # خاکستری تیره‌تر برای گرید
DARK_LINE_COLOR_PRIMARY = '#4e9a06' # سبز روشن
DARK_LINE_COLOR_SECONDARY = '#3465a4'# آبی روشن
DARK_HIGHLIGHT_COLOR_POS = '#73d216' # سبز لیمویی (برای سود)
DARK_HIGHLIGHT_COLOR_NEG = '#cc0000' # قرمز تیره (برای ضرر/VaR)
DARK_HIGHLIGHT_COLOR_MEAN = '#fce94f' # زرد طلایی
DARK_HIGHLIGHT_COLOR_MEDIAN = '#729fcf'# آبی آسمانی

# --- متون برای چندزبانگی (بدون تغییر) ---
texts = {
    'app_title': {'en': "Advanced Risk & Return Analyzer", 'fa': "تحلیلگر پیشرفته ریسک و بازده"},
    'status_ready': {'en': "Ready.", 'fa': "آماده."},
    'status_calculating': {'en': "Calculating metrics...", 'fa': "درحال محاسبه معیارها..."},
    'status_calc_done': {'en': "Calculations complete.", 'fa': "محاسبات کامل شد."},
    'status_calc_error': {'en': "Calculation error: {error}", 'fa': "خطا در محاسبات: {error}"},
    'status_plotting_hist': {'en': "Plotting histogram...", 'fa': "درحال رسم هیستوگرام..."},
    'status_plotting_box': {'en': "Plotting box plot...", 'fa': "درحال رسم نمودار جعبه‌ای..."},
    'status_plotting_equity': {'en': "Plotting equity curve...", 'fa': "درحال رسم نمودار ارزش تجمعی..."},
    'status_plotting_qq': {'en': "Plotting QQ-plot...", 'fa': "درحال رسم نمودار QQ..."},
    'status_plot_done': {'en': "Plot generated.", 'fa': "نمودار رسم شد."},
    'status_plot_error': {'en': "Error plotting: {error}", 'fa': "خطا در رسم نمودار: {error}"},
    'status_data_added': {'en': "{count} data point(s) added.", 'fa': "{count} داده با موفقیت اضافه شد."},
    'status_data_invalid': {'en': "{count} added. Some invalid entries ignored: {entries}", 'fa': "{count} داده اضافه شد. برخی ورودی‌های نامعتبر نادیده گرفته شد: {entries}"},
    'status_no_valid_data': {'en': "Error: No valid data entered.", 'fa': "خطا: هیچ داده معتبری وارد نشد."},
    'status_empty_input': {'en': "Empty input ignored.", 'fa': "ورودی خالی نادیده گرفته شد."},
    'status_data_edited': {'en': "Data point {index} edited from {old_val}% to {new_val}%.", 'fa': "داده {index} از {old_val}% به {new_val}% ویرایش شد."},
    'status_data_deleted': {'en': "Data point {index} ({val}%) deleted.", 'fa': "داده {index} ({val}%) حذف شد."},
    'status_list_cleared': {'en': "Data list cleared.", 'fa': "لیست داده‌ها پاک شد."},
    'status_results_reset': {'en': "Results reset. Click 'Calculate' to analyze.", 'fa': "نتایج پاک شدند. برای تحلیل مجدد، 'محاسبه معیارها' را بزنید."},
    'status_saving_results': {'en': "Preparing to save results...", 'fa': "آماده‌سازی برای ذخیره نتایج..."},
    'status_saving_data': {'en': "Preparing to save data...", 'fa': "آماده‌سازی برای ذخیره داده‌ها..."},
    'status_save_success': {'en': "Results saved to '{filename}'.", 'fa': "نتایج در '{filename}' ذخیره شد."},
    'status_data_save_success': {'en': "Data saved to '{filename}'.", 'fa': "داده‌ها در '{filename}' ذخیره شد."},
    'status_save_cancel': {'en': "Save operation cancelled.", 'fa': "عملیات ذخیره لغو شد."},
    'status_save_error': {'en': "Error saving file.", 'fa': "خطا در ذخیره فایل."},
    'status_import_cancel': {'en': "Import operation cancelled.", 'fa': "عملیات وارد کردن لغو شد."},
    'status_importing': {'en': "Reading file '{filename}'...", 'fa': "درحال خواندن فایل '{filename}'..."},
    'status_import_success': {'en': "{count} data points imported successfully.", 'fa': "{count} داده با موفقیت از فایل وارد شد."},
    'status_import_error': {'en': "Error reading file.", 'fa': "خطا در خواندن فایل."},
    'status_import_format_error': {'en': "Error: Invalid file format.", 'fa': "خطا: فرمت فایل نامعتبر."},
    'status_import_no_numeric': {'en': "Error: No numeric column found.", 'fa': "خطا: ستون عددی پیدا نشد."},
    'status_import_no_valid': {'en': "Error: No valid numeric data found in column.", 'fa': "خطا: داده معتبر پیدا نشد."},
    'status_rf_error': {'en': "Error: Invalid Risk-Free Rate.", 'fa': "خطا: نرخ بدون ریسک نامعتبر."},
    'status_need_data_calc': {'en': "Insufficient data for calculation (min 2 points).", 'fa': "داده ناکافی برای محاسبه (حداقل ۲ داده)."},
    'status_need_data_plot': {'en': "No data to plot.", 'fa': "داده‌ای برای رسم نمودار وجود ندارد."},
    'status_no_results': {'en': "No results to save.", 'fa': "نتیجه‌ای برای ذخیره وجود ندارد."},
    'status_no_data_save': {'en': "No data to save.", 'fa': "داده‌ای برای ذخیره وجود ندارد."},
    'status_select_edit': {'en': "Select an item to edit first.", 'fa': "ابتدا یک داده را برای ویرایش انتخاب کنید."},
    'status_select_delete': {'en': "Select an item to delete first.", 'fa': "ابتدا یک داده را برای حذف انتخاب کنید."},
    'status_edit_empty': {'en': "New value cannot be empty.", 'fa': "مقدار جدید نمی‌تواند خالی باشد."},
    'status_edit_invalid': {'en': "Invalid value entered.", 'fa': "مقدار وارد شده نامعتبر است."},
    'status_edit_index_error': {'en': "Error saving data (index error).", 'fa': "خطا در ذخیره داده (خطای اندیس)."},
    'status_delete_index_error': {'en': "Error deleting data (index error).", 'fa': "خطا در حذف داده (خطای اندیس)."},

    'results_title': {'en': "Analysis Results:", 'fa': "نتایج تحلیل:"},
    'data_count': {'en': "Data Points", 'fa': "تعداد داده‌ها"},
    'mean_label': {'en': "Arithmetic Mean", 'fa': "میانگین حسابی"},
    'ci_label': {'en': "95% CI for Mean", 'fa': "فاصله اطمینان ۹۵% میانگین"},
    'geo_mean_label': {'en': "Geometric Mean (CAGR)", 'fa': "میانگین هندسی (CAGR)"},
    'std_dev_label': {'en': "Standard Deviation (Risk)", 'fa': "انحراف معیار (ریسک)"},
    'downside_dev_label': {'en': "Downside Deviation (Target=0)", 'fa': "انحراف معیار نزولی (هدف=۰)"},
    'variance_label': {'en': "Variance", 'fa': "واریانس"},
    'cv_label': {'en': "Coefficient of Variation (CV)", 'fa': "ضریب تغییرات (CV)"},
    'mdd_label': {'en': "Max Drawdown (MDD)", 'fa': "حداکثر افت سرمایه (MDD)"},
    'mdd_period_label': {'en': "MDD Period (steps)", 'fa': "دوره MDD (تعداد دوره)"},
    'skewness_label': {'en': "Skewness", 'fa': "چولگی"},
    'kurtosis_label': {'en': "Excess Kurtosis", 'fa': "کشیدگی اضافی"},
    'normality_label': {'en': "Normality (Shapiro-Wilk)", 'fa': "نرمال بودن (شاپیرو-ویلک)"},
    'var_label': {'en': "Historical VaR 5%", 'fa': "VaR تاریخی ۵٪"},
    'var_95_label': {'en': "Historical Gain 95%", 'fa': "سود تاریخی ۹۵٪"},
    'max_gain_label': {'en': "Max Gain", 'fa': "حداکثر سود"},
    'sharpe_label': {'en': "Sharpe Ratio", 'fa': "نسبت شارپ"},
    'sortino_label': {'en': "Sortino Ratio", 'fa': "نسبت سورتینو"},
    'save_results_button': {'en': "Save Results to Text File", 'fa': "ذخیره نتایج در فایل متنی"},
    'data_management_title': {'en': "Data Management:", 'fa': "مدیریت داده‌ها:"},
    'import_button': {'en': "Import Data (CSV/Excel)", 'fa': "وارد کردن داده از فایل (CSV/Excel)"},
    'export_data_button': {'en': "Save Data to Excel", 'fa': "ذخیره داده‌ها در Excel"},
    'add_data_title': {'en': " Add New Data (%)", 'fa': "۲. افزودن داده جدید (%)"},
    'add_data_hint': {'en': "(Enter multiple values separated by comma, space, or newline)", 'fa': "(می‌توانید چندین مقدار با کاما، فاصله یا خط جدید وارد کنید)"},
    'add_data_placeholder': {'en': "Enter value(s) and press Enter or 'Add'", 'fa': "مقدار(ها) را وارد و Enter یا 'افزودن' را بزنید"},
    'add_button': {'en': "Add", 'fa': "افزودن"},
    'edit_delete_title': {'en': " Edit / Delete Data:", 'fa': "۳. ویرایش / حذف داده:"},
    'edit_placeholder': {'en': "New value", 'fa': "مقدار جدید"},
    'save_button': {'en': "Save", 'fa': "ذخیره"},
    'delete_button': {'en': "Delete", 'fa': "حذف"},
    'rf_title': {'en': " Risk-Free Rate (% Annually):", 'fa': "۴. نرخ بازده بدون ریسک (% سالانه):"},
    'rf_placeholder': {'en': "e.g., 2.5", 'fa': "مثلا 2.5"},
    'data_list_title': {'en': " Current Data List:", 'fa': "۵. لیست داده‌های فعلی:"},
    'clear_list_button': {'en': "Clear Entire List", 'fa': "پاک کردن کل لیست"},
    'calculate_button': {'en': " Calculate Metrics", 'fa': "۶. محاسبه معیارها"},
    'plot_hist_button': {'en': "Plot Histogram", 'fa': "رسم هیستوگرام"},
    'plot_box_button': {'en': "Plot Box Plot", 'fa': "رسم نمودار جعبه‌ای"},
    'plot_equity_button': {'en': "Plot Equity Curve", 'fa': "رسم نمودار ارزش تجمعی"},
    'plot_qq_button': {'en': "Plot QQ-Plot", 'fa': "رسم نمودار QQ"},
    'lang_select_label': {'en': "Language:", 'fa': "زبان:"},
    'list_empty_option': {'en': "List Empty", 'fa': "لیست خالی است"},
    'select_option': {'en': "Select...", 'fa': "انتخاب کنید..."},
    'data_option_format': {'en': "Data {index} ({value:.2f}%)", 'fa': "داده {index} ({value:.2f}%)"},

    'mean_tooltip': {'en': "Arithmetic Mean: Simple average of returns.", 'fa': "میانگین حسابی: میانگین ساده بازده‌ها."},
    'geo_mean_tooltip': {'en': "Geometric Mean (CAGR): Compound average rate of return.\nMore accurate for long-term performance.", 'fa': "میانگین هندسی (CAGR): نرخ بازده متوسط ترکیبی.\nمناسب برای عملکرد بلندمدت."},
    'ci_tooltip': {'en': "95% Confidence Interval for Mean: Range likely to contain the true population mean\nwith 95% confidence (based on t-distribution).", 'fa': "فاصله اطمینان ۹۵٪: بازه‌ای که با اطمینان ۹۵٪ می‌توان گفت\nمیانگین واقعی جامعه در آن قرار دارد (بر اساس توزیع t)."},
    'std_dev_tooltip': {'en': "Standard Deviation: Dispersion of returns around the mean (Total Risk).\nHigher value = more volatility/risk.", 'fa': "انحراف معیار: پراکندگی بازده‌ها حول میانگین (ریسک کل).\nمقدار بالاتر = نوسان و ریسک بیشتر."},
    'downside_dev_tooltip': {'en': "Downside Deviation (Target=0): Dispersion of returns below zero.\nMeasures unfavorable volatility (Loss Risk).", 'fa': "انحراف معیار نزولی (هدف=۰): پراکندگی بازده‌های زیر صفر.\nمعیاری از ریسک نامطلوب (ریسک زیان)."},
    'variance_tooltip': {'en': "Variance: Average squared deviation from the mean.\nPrimary unit of dispersion. Variance = Std Dev^2.", 'fa': "واریانس: میانگین مجذور انحرافات از میانگین.\nواحد اصلی پراکندگی."},
    'cv_tooltip': {'en': "Coefficient of Variation (CV): Risk per unit of return (StdDev / Mean).\nUseful for comparing risk of assets with different returns. Lower is better.", 'fa': "ضریب تغییرات (CV): ریسک به ازای واحد بازده.\nبرای مقایسه ریسک دارایی‌ها با بازده متفاوت. پایین‌تر بهتر است."},
    'mdd_tooltip': {'en': "Maximum Drawdown: Largest peak-to-trough percentage decline\nin cumulative returns. Measures downside risk.", 'fa': "حداکثر افت سرمایه: بزرگترین افت درصدی از قله قبلی\nدر بازده تجمعی. ریسک افت شدید را می‌سنجد."},
    'mdd_period_tooltip': {'en': "MDD Period: Duration (in number of data points/periods)\nof the maximum drawdown, from peak to recovery (or end).", 'fa': "دوره MDD: طول دوره (تعداد نقاط داده)\nحداکثر افت سرمایه، از قله تا بازیابی (یا انتها)."},
    'skewness_tooltip': {'en': "Skewness: Asymmetry of the distribution.\nNegative: Longer left tail (large losses more likely).\nPositive: Longer right tail (large gains more likely).\nZero: Symmetric (like Normal).", 'fa': "چولگی: عدم تقارن توزیع.\nمنفی: دم بلندتر چپ (زیان‌های بزرگ محتمل‌تر).\nمثبت: دم بلندتر راست (سودهای بزرگ محتمل‌تر).\nصفر: متقارن."},
    'kurtosis_tooltip': {'en': "Excess Kurtosis: Fatness of the distribution's tails relative to Normal (Kurtosis - 3).\nPositive: Fatter tails, higher probability of extreme values (Tail Risk).", 'fa': "کشیدگی اضافی: چاقی دم‌های توزیع نسبت به نرمال.\nمثبت: دم‌های چاق‌تر، احتمال مقادیر حدی بیشتر (ریسک دم)."},
    'normality_tooltip': {'en': "Shapiro-Wilk Normality Test: Tests if data significantly deviates\nfrom a normal distribution. W-statistic and p-value shown.\np < 0.05 often suggests non-normality.", 'fa': "آزمون نرمال بودن شاپیرو-ویلک: آزمون می‌کند آیا داده‌ها\nبه طور معناداری از توزیع نرمال انحراف دارند یا خیر.\nآماره W و p-value نمایش داده می‌شود.\np < 0.05 معمولا نشان‌دهنده عدم نرمال بودن است."},
    'var_tooltip': {'en': "Historical Value at Risk (VaR) 5%: Maximum loss expected to be exceeded only 5% of the time\n(based on the 5th percentile of historical data).", 'fa': "ارزش در معرض خطر (VaR) ۵٪ تاریخی: حداکثر زیانی که انتظار می‌رود\nدر ۹۵٪ مواقع از آن کمتر باشد (بر اساس صدک پنجم داده‌های گذشته)."},
    'var_95_tooltip': {'en': "Historical Gain 95%: Minimum gain achieved in the best 5% of periods\n(based on the 95th percentile of historical data).", 'fa': "سود تاریخی ۹۵٪: حداقل سودی که در ۵٪ بهترین دوره‌ها بدست آمده\n(بر اساس صدک ۹۵ام داده‌های گذشته)."},
    'max_gain_tooltip': {'en': "Maximum Gain: The highest single period return observed in the data.", 'fa': "حداکثر سود: بیشترین بازده مشاهده شده در یک دوره در داده‌ها."},
    'sharpe_tooltip': {'en': "Sharpe Ratio: Excess return over risk-free rate per unit of total risk.\nSharpe = (Mean Return - Rf) / Std Dev.\nHigher is better risk-adjusted performance.", 'fa': "نسبت شارپ: بازده مازاد بر نرخ بدون ریسک به ازای هر واحد ریسک کل.\nبالاتر = عملکرد تعدیل‌شده بر اساس ریسک بهتر."},
    'sortino_tooltip': {'en': "Sortino Ratio: Excess return over risk-free rate per unit of downside risk.\nSortino = (Mean Return - Rf) / Downside Deviation.\nPenalizes only bad risk. Higher is better.", 'fa': "نسبت سورتینو: بازده مازاد بر نرخ بدون ریسک به ازای هر واحد ریسک نزولی.\nریسک بد را مجازات می‌کند. بالاتر بهتر است."},
    'rf_tooltip': {'en': "Risk-Free Rate: Expected return on a zero-risk investment (e.g., government bonds).\nUsed to calculate excess return for Sharpe/Sortino ratios.\nEnter as annual percentage (e.g., 3.5 for 3.5%).", 'fa': "نرخ بازده بدون ریسک: نرخ بازده مورد انتظار از سرمایه‌گذاری بدون ریسک (مانند اوراق خزانه).\nبرای محاسبه بازده مازاد در نسبت‌های شارپ و سورتینو. به صورت درصد سالانه وارد کنید (مثلا 3.5)."},

    'file_select_title': {'en': "Select Data File (CSV or Excel)", 'fa': "انتخاب فایل داده (CSV یا Excel)"},
    'save_results_title': {'en': "Save Analysis Results", 'fa': "ذخیره نتایج تحلیل"},
    'save_data_title': {'en': "Save Data to Excel", 'fa': "ذخیره داده‌ها در Excel"},
    'error_title': {'en': "Error", 'fa': "خطا"},
    'warning_title': {'en': "Warning", 'fa': "هشدار"},
    'info_title': {'en': "Information", 'fa': "اطلاعات"},
    'invalid_format_msg': {'en': "Only CSV and Excel files are supported.", 'fa': "فقط فایل‌های CSV و Excel پشتیبانی می‌شوند."},
    'file_not_found_msg': {'en': "File not found:\n{path}", 'fa': "فایل پیدا نشد:\n{path}"},
    'file_read_error_msg': {'en': "Error reading file:\n{error}", 'fa': "خطایی در هنگام خواندن فایل رخ داد:\n{error}"},
    'file_save_error_msg': {'en': "Error saving file:\n{error}", 'fa': "خطایی در هنگام ذخیره فایل رخ داد:\n{error}"},

    'plot_hist_title': {'en': 'Histogram with VaR and Gain Tails', 'fa': 'هیستوگرام با نواحی VaR و سود'},
    'plot_xlabel': {'en': 'Return (%)', 'fa': 'درصد بازده (%)'},
    'plot_ylabel_hist': {'en': 'Frequency / Density', 'fa': 'فراوانی / چگالی'},
    'plot_kde_label': {'en': 'Density Estimate (KDE)', 'fa': 'تخمین چگالی (KDE)'},
    'plot_mean_label': {'en': 'Mean: {val:.2f}', 'fa': 'میانگین: {val:.2f}'},
    'plot_median_label': {'en': 'Median: {val:.2f}', 'fa': 'میانه: {val:.2f}'},
    'plot_norm_label': {'en': 'Normal Fit (μ={mean:.1f}, σ={std:.1f})', 'fa': 'توزیع نرمال متناظر (μ={mean:.1f}, σ={std:.1f})'},
    'plot_hist_data_label': {'en': 'Data Frequency', 'fa': 'فراوانی داده‌ها'},
    'plot_var_label': {'en': 'VaR 5% ({val:.2f}%)', 'fa': 'VaR ۵٪ ({val:.2f}%)'},
    'plot_gain_label': {'en': 'Gain 95% ({val:.2f}%)', 'fa': 'سود ۹۵٪ ({val:.2f}%)'},
    'plot_box_title': {'en': 'Box Plot of Returns', 'fa': 'نمودار جعبه‌ای بازده‌ها'},
    'plot_ylabel_box': {'en': 'Return (%)', 'fa': 'درصد بازده (%)'},
    'plot_equity_title': {'en': 'Equity Curve (Cumulative Growth)', 'fa': 'نمودار ارزش تجمعی'},
    'plot_equity_ylabel': {'en': 'Cumulative Value (starts at 1000)', 'fa': 'ارزش تجمعی (شروع از ۱۰۰۰)'},
    'plot_equity_xlabel': {'en': 'Period / Data Point Index', 'fa': 'دوره / ردیف داده'},
    'plot_qq_title': {'en': 'Quantile-Quantile Plot (vs Normal Distribution)', 'fa': 'نمودار QQ (مقایسه با توزیع نرمال)'},
    'plot_qq_ylabel': {'en': 'Sample Quantiles (Data)', 'fa': 'چارک‌های نمونه (داده‌ها)'},
    'plot_qq_xlabel': {'en': 'Theoretical Quantiles (Normal)', 'fa': 'چارک‌های نظری (نرمال)'},

    'na_value': {'en': "N/A", 'fa': "نامعتبر"},
    'col_index': {'en': "Index", 'fa': "ردیف"},
    'col_return': {'en': "Return (%)", 'fa': "بازده (%)"},
}

def create_font(primary_family="Vazir", size=12, weight="normal", slant="roman"):
    system = platform.system()
    if system == "Windows": fallback_family = "Vazir"
    elif system == "Darwin": fallback_family = "Helvetica"
    else: fallback_family = "DejaVu Sans"
    try:
        import tkinter.font
        font_families = tkinter.font.families()
        if primary_family in font_families: return ctk.CTkFont(family=primary_family, size=size, weight=weight, slant=slant)
        else: print(f"Warning: Font '{primary_family}' not found by Tkinter. Trying fallback '{fallback_family}'.")
    except Exception as e_primary: print(f"Warning: Font '{primary_family}' check failed ({e_primary}). Using fallback '{fallback_family}'.")
    try:
        import tkinter.font
        font_families = tkinter.font.families()
        if fallback_family in font_families: return ctk.CTkFont(family=fallback_family, size=size, weight=weight, slant=slant)
        else: print(f"Warning: Fallback font '{fallback_family}' not found by Tkinter. Using system default.")
    except Exception as e_fallback: print(f"Warning: Fallback font '{fallback_family}' failed ({e_fallback}). Using system default.")
    return ctk.CTkFont(size=size, weight=weight, slant=slant)

def resource_path(relative_path):
    try: base_path = sys._MEIPASS
    except Exception: base_path = os.path.abspath(".")
    return os.path.join(base_path, relative_path)

class AdvancedAnalyticsApp(ctk.CTk):
    def __init__(self):
        super().__init__()

        self._is_closing = False
        self.current_lang = 'fa'
        self.data_points = []
        self.calculated_results = {}
        self.selected_edit_index = tk.IntVar(value=-1)
        self.tooltip_window = None
        self.result_labels = {}
        self.title_labels = {}
        self._active_plot_windows = {}

        self.header_font = create_font(size=17, weight="bold")
        self.normal_font = create_font(size=15)
        self.button_font = create_font(size=14, weight="bold")
        self.entry_font = create_font(size=15)
        self.textbox_font = create_font(size=14)
        self.result_label_font = create_font(size=15)
        self.result_value_font = create_font(size=15, weight="bold")
        self.tooltip_icon_font = create_font(size=15, weight="bold")
        self.tooltip_text_font = create_font(size=12)
        self.status_font = create_font(size=12)
        self.desc_font = create_font(size=12, slant="italic")

        # --- مهم: تنظیم استایل Matplotlib و رنگ‌های اصلی برای تم تیره ---
        self.apply_matplotlib_dark_theme()
        self.setup_matplotlib_font()

        self.title(self._t('app_title'))
        self.geometry("1300x900")
        self.minsize(1100, 750)

        self.status_bar = ctk.CTkLabel(self, text="", font=self.status_font, anchor="w", text_color=DARK_TEXT_COLOR) # <- رنگ متن نوار وضعیت
        self.status_bar.pack(side=tk.BOTTOM, fill=tk.X, padx=10, pady=(5, 5))

        main_app_frame = ctk.CTkFrame(self, fg_color="transparent")
        main_app_frame.pack(side=tk.TOP, fill=tk.BOTH, expand=True, padx=0, pady=0)

        results_panel_frame = ctk.CTkFrame(main_app_frame, width=450) # fg_color پیش‌فرض CTk مناسب است
        results_panel_frame.pack(side=ctk.LEFT, fill=ctk.Y, padx=(15, 5), pady=(10, 0))
        results_panel_frame.pack_propagate(False)

        top_left_frame = ctk.CTkFrame(results_panel_frame, fg_color="transparent")
        top_left_frame.pack(pady=(10, 5), padx=15, fill="x")
        self.lang_label = ctk.CTkLabel(top_left_frame, text="", font=self.normal_font)
        self.lang_label.pack(side=tk.LEFT, padx=(0, 5))
        self.lang_var = tk.StringVar(value="فارسی")
        self.lang_menu = ctk.CTkOptionMenu(top_left_frame, variable=self.lang_var, values=["English", "فارسی"], command=self.change_language, font=self.normal_font, width=100)
        self.lang_menu.pack(side=tk.LEFT, padx=(0, 15))
        self.results_title_label = ctk.CTkLabel(top_left_frame, text="", font=self.header_font, anchor="center")
        self.results_title_label.pack(side=tk.LEFT, expand=True, fill='x')

        self.count_label = ctk.CTkLabel(results_panel_frame, text="", font=self.result_value_font, anchor="w")
        self.count_label.pack(pady=2, padx=20, fill="x")

        self.create_result_label_with_tooltip(results_panel_frame, 'mean_label', 'mean_tooltip')
        self.create_result_label_with_tooltip(results_panel_frame, 'ci_label', 'ci_tooltip')
        self.create_result_label_with_tooltip(results_panel_frame, 'geo_mean_label', 'geo_mean_tooltip')
        self.create_result_label_with_tooltip(results_panel_frame, 'std_dev_label', 'std_dev_tooltip', bold_value=True)
        self.create_result_label_with_tooltip(results_panel_frame, 'downside_dev_label', 'downside_dev_tooltip')
        self.create_result_label_with_tooltip(results_panel_frame, 'variance_label', 'variance_tooltip')
        self.create_result_label_with_tooltip(results_panel_frame, 'cv_label', 'cv_tooltip')
        self.create_result_label_with_tooltip(results_panel_frame, 'mdd_label', 'mdd_tooltip', bold_value=True)
        self.create_result_label_with_tooltip(results_panel_frame, 'mdd_period_label', 'mdd_period_tooltip')
        self.create_result_label_with_tooltip(results_panel_frame, 'skewness_label', 'skewness_tooltip')
        self.create_result_label_with_tooltip(results_panel_frame, 'kurtosis_label', 'kurtosis_tooltip')
        self.create_result_label_with_tooltip(results_panel_frame, 'normality_label', 'normality_tooltip')
        self.create_result_label_with_tooltip(results_panel_frame, 'var_label', 'var_tooltip', bold_value=True)
        self.create_result_label_with_tooltip(results_panel_frame, 'var_95_label', 'var_95_tooltip')
        self.create_result_label_with_tooltip(results_panel_frame, 'max_gain_label', 'max_gain_tooltip', bold_value=True)
        self.create_result_label_with_tooltip(results_panel_frame, 'sharpe_label', 'sharpe_tooltip', bold_value=True)
        self.create_result_label_with_tooltip(results_panel_frame, 'sortino_label', 'sortino_tooltip', bold_value=True)

        bottom_left_frame = ctk.CTkFrame(results_panel_frame, fg_color="transparent")
        bottom_left_frame.pack(side=tk.BOTTOM, fill='x', pady=(10, 15), padx=15)
        self.export_button = ctk.CTkButton(bottom_left_frame, text="", command=self.export_results_to_txt, font=self.button_font, state="disabled")
        self.export_button.pack(pady=(0, 10), fill='x')
        self.data_management_title_label = ctk.CTkLabel(bottom_left_frame, text="", font=self.header_font, anchor="center")
        self.data_management_title_label.pack(pady=(5, 5), fill='x')
        file_buttons_inner_frame = ctk.CTkFrame(bottom_left_frame, fg_color="transparent")
        file_buttons_inner_frame.pack(pady=5, fill='x')
        self.import_button = ctk.CTkButton(file_buttons_inner_frame, text="", command=self.import_data_from_file, font=self.button_font)
        self.import_button.pack(side="right", padx=(5, 0), expand=True, fill='x')
        self.export_data_button = ctk.CTkButton(file_buttons_inner_frame, text="", command=self.export_data_to_excel, font=self.button_font, state="disabled")
        self.export_data_button.pack(side="left", padx=(0, 5), expand=True, fill='x')

        main_content_frame = ctk.CTkFrame(main_app_frame, fg_color="transparent")
        main_content_frame.pack(side=ctk.RIGHT, fill=tk.BOTH, expand=True, padx=(5, 15), pady=(10,0))
        input_section_frame = ctk.CTkFrame(main_content_frame) # fg_color پیش‌فرض CTk
        input_section_frame.pack(pady=5, padx=10, fill="x", side=tk.TOP)
        self.add_data_title_label = ctk.CTkLabel(input_section_frame, text="", font=self.header_font, anchor="e")
        self.add_data_title_label.pack(pady=(5, 2), padx=10, fill="x")
        self.add_data_hint_label = ctk.CTkLabel(input_section_frame, text="", font=self.desc_font, anchor="e", text_color="gray")
        self.add_data_hint_label.pack(pady=(0, 5), padx=10, fill="x")
        entry_frame = ctk.CTkFrame(input_section_frame, fg_color="transparent")
        entry_frame.pack(pady=(2, 5), padx=10, fill="x")
        self.value_entry = ctk.CTkEntry(entry_frame, placeholder_text="", font=self.entry_font, justify='right')
        self.value_entry.pack(side="right", fill="x", expand=True, padx=(0, 10), ipady=5)
        self.value_entry.bind("<Return>", self.add_data_point_event)
        self.add_button = ctk.CTkButton(entry_frame, text="", width=80, command=self.add_data_point, font=self.button_font, height=31)
        self.add_button.pack(side="left", ipady=3)

        edit_section_frame = ctk.CTkFrame(main_content_frame)
        edit_section_frame.pack(pady=5, padx=10, fill="x", side=tk.TOP)
        self.edit_delete_title_label = ctk.CTkLabel(edit_section_frame, text="", font=self.header_font, anchor="e")
        self.edit_delete_title_label.pack(pady=(5, 5), padx=10, fill="x")
        edit_controls_frame = ctk.CTkFrame(edit_section_frame, fg_color="transparent")
        edit_controls_frame.pack(pady=(2, 5), padx=10, fill="x")
        self.edit_option_var = tk.StringVar(value="")
        self.edit_optionmenu = ctk.CTkOptionMenu(edit_controls_frame, variable=self.edit_option_var, command=self.load_value_for_edit_from_menu, values=[""], font=self.normal_font, state="disabled", width=200, dynamic_resizing=False, anchor="e")
        self.edit_optionmenu.pack(side="right", padx=(0, 5))
        self.edit_value_entry = ctk.CTkEntry(edit_controls_frame, placeholder_text="", font=self.entry_font, justify='right', state="disabled")
        self.edit_value_entry.pack(side="right", fill="x", expand=True, padx=(5, 5), ipady=5)
        self.edit_value_entry.bind("<Return>", self.save_edited_value_event)
        edit_buttons_frame = ctk.CTkFrame(edit_controls_frame, fg_color="transparent")
        edit_buttons_frame.pack(side="left", padx=(5,0))
        self.delete_button = ctk.CTkButton(edit_buttons_frame, text="", width=55, command=self.delete_selected_data, font=self.button_font, height=31, state="disabled", fg_color="#E57373", hover_color="#EF5350")
        self.delete_button.pack(side="right", padx=(5,0), ipady=3)
        self.save_edit_button = ctk.CTkButton(edit_buttons_frame, text="", width=60, command=self.save_edited_value, font=self.button_font, height=31, state="disabled")
        self.save_edit_button.pack(side="left", ipady=3)

        rf_frame = ctk.CTkFrame(main_content_frame)
        rf_frame.pack(pady=5, padx=10, fill="x", side=tk.TOP)
        self.create_rf_input_with_tooltip(rf_frame, 'rf_title', 'rf_tooltip')

        display_frame = ctk.CTkFrame(main_content_frame)
        display_frame.pack(pady=5, padx=10, fill="both", expand=True, side=tk.TOP)
        self.data_list_title_label = ctk.CTkLabel(display_frame, text="", font=self.header_font, anchor="e")
        self.data_list_title_label.pack(pady=(5, 2), padx=10, fill="x")
        self.data_display_textbox = ctk.CTkTextbox(display_frame, font=self.textbox_font, state="disabled", wrap="word")
        self.data_display_textbox.pack(pady=5, padx=10, fill="both", expand=True)
        self.clear_list_button = ctk.CTkButton(display_frame, text="", command=self.clear_data_list, fg_color="#D32F2F", hover_color="#B71C1C", font=self.button_font, height=31)
        self.clear_list_button.pack(pady=(5, 10), ipady=3)

        action_buttons_frame = ctk.CTkFrame(main_content_frame, fg_color="transparent")
        action_buttons_frame.pack(pady=(5, 10), padx=10, fill="x", side=tk.BOTTOM)
        self.calculate_button = ctk.CTkButton(action_buttons_frame, text="", command=self.calculate_metrics, font=self.button_font, height=40)
        self.calculate_button.pack(side="left", padx=(0, 10), ipady=4, fill='x', expand=True)
        plot_buttons_frame = ctk.CTkFrame(action_buttons_frame, fg_color="transparent")
        plot_buttons_frame.pack(side="right", fill='x', expand=True)
        btn_height=38; btn_padx=(3,3)
        self.plot_hist_button = ctk.CTkButton(plot_buttons_frame, text="", command=self.plot_histogram_action, font=self.button_font, height=btn_height, state="disabled")
        self.plot_hist_button.pack(side="left", padx=btn_padx, expand=True, fill='x')
        self.plot_box_button = ctk.CTkButton(plot_buttons_frame, text="", command=self.plot_boxplot_action, font=self.button_font, height=btn_height, state="disabled")
        self.plot_box_button.pack(side="left", padx=btn_padx, expand=True, fill='x')
        self.plot_equity_button = ctk.CTkButton(plot_buttons_frame, text="", command=self.plot_equity_curve_action, font=self.button_font, height=btn_height, state="disabled")
        self.plot_equity_button.pack(side="left", padx=btn_padx, expand=True, fill='x')
        self.plot_qq_button = ctk.CTkButton(plot_buttons_frame, text="", command=self.plot_qqplot_action, font=self.button_font, height=btn_height, state="disabled")
        self.plot_qq_button.pack(side="left", padx=(btn_padx[0], 0), expand=True, fill='x')

        self.update_language(self.current_lang)
        self.value_entry.focus()
        self._update_edit_controls_state()
        self.reset_results()
        self.update_data_display()
        self._update_action_buttons_state()
        self.protocol("WM_DELETE_WINDOW", self.on_closing)

    def apply_matplotlib_dark_theme(self):
        """Applies a dark theme consistently to Matplotlib plots."""
        try:
            # Use a base dark style first
            plt.style.use('dark_background')
            # Override/set specific parameters for better control and appearance
            plt.rcParams.update({
                "figure.facecolor": DARK_BACKGROUND_COLOR, # Background for the whole figure area
                "axes.facecolor": DARK_AXES_COLOR,      # Background for the plotting area
                "text.color": DARK_TEXT_COLOR,          # Default text color
                "axes.labelcolor": DARK_TEXT_COLOR,     # Color for x, y labels
                "xtick.color": DARK_TEXT_COLOR,         # Color for x-axis ticks
                "ytick.color": DARK_TEXT_COLOR,         # Color for y-axis ticks
                "axes.edgecolor": DARK_GRID_COLOR,      # Color for plot border/spines
                "axes.titlecolor": DARK_TEXT_COLOR,     # Color for plot title
                "grid.color": DARK_GRID_COLOR,          # Color for the grid lines
                "grid.linestyle": ":",
                "grid.linewidth": 0.6,
                "legend.facecolor": DARK_AXES_COLOR,    # Legend background
                "legend.edgecolor": DARK_GRID_COLOR,    # Legend border
                "legend.labelcolor": DARK_TEXT_COLOR,   # Explicitly set legend text color
            })
            print(f"Applied custom dark theme to Matplotlib. BG: {DARK_BACKGROUND_COLOR}")
        except Exception as e:
            print(f"Warning: Could not apply custom dark theme: {e}. Using fallback.")
            # Fallback just in case basic dark_background fails
            plt.rcParams.update({
                "figure.facecolor": 'black',
                "axes.facecolor": '#222222',
                "text.color": "white",
                "axes.labelcolor": "white",
                "xtick.color": "white",
                "ytick.color": "white",
                "axes.edgecolor": "gray",
                "axes.titlecolor": "white",
                "grid.color": "gray",
                "legend.facecolor": '#222222',
                "legend.edgecolor": "gray",
                "legend.labelcolor": "white",
            })

    def setup_matplotlib_font(self):
        primary_font = "Vazir"
        try:
            font_path = plt.font_manager.findfont(primary_font, fallback_to_default=False)
            plt.rcParams['font.family'] = primary_font
            print(f"Using '{primary_font}' font for Matplotlib (Path: {font_path}).")
        except Exception:
            print(f"Warning: Font '{primary_font}' not found by Matplotlib. Trying fallback.")
            try:
                system = platform.system()
                if system == "Windows": fallback = "Vazir"
                elif system == "Darwin": fallback = "Helvetica"
                else: fallback = "DejaVu Sans"
                plt.rcParams['font.family'] = fallback
                print(f"Using Matplotlib fallback font: {fallback}")
            except Exception as e_plt:
                print(f"Matplotlib font setting failed completely: {e_plt}")
        plt.rcParams['axes.unicode_minus'] = False

    def _t(self, key, **kwargs):
        try: return texts[key][self.current_lang].format(**kwargs)
        except KeyError:
            if self.current_lang != 'en':
                try: return texts[key]['en'].format(**kwargs)
                except KeyError: return key
            return key

    def _reshape_fa(self, text):
        if self.current_lang == 'fa':
            try:
                reshaped_text = arabic_reshaper.reshape(text)
                bidi_text = get_display(reshaped_text)
                return bidi_text
            except Exception as e: print(f"Error reshaping/bidi text '{text}': {e}"); return text
        return text

    def change_language(self, selected_lang_name):
        if self._is_closing: return
        new_lang = 'fa' if selected_lang_name == "فارسی" else 'en'
        if new_lang != self.current_lang:
            self.current_lang = new_lang
            self.update_language(new_lang)
            self.update_status('status_ready')
            self.setup_matplotlib_font() # Ensure font is reapplied

    # --- update_language, show_tooltip, hide_tooltip, etc. (بدون تغییر نسبت به نسخه قبل) ---
    def update_language(self, lang):
        if self._is_closing: return
        try:
            self.title(self._t('app_title'))
            self.status_bar.configure(text=self._t('status_ready'))
            self.lang_label.configure(text=self._t('lang_select_label'))
            self.results_title_label.configure(text=self._t('results_title'))
            for key_title, title_widget in self.title_labels.items():
                 if title_widget.winfo_exists():
                     label_key = key_title.replace("_title", "")
                     title_widget.configure(text=f"{self._t(label_key)}:")
            self.reset_results()
            self.export_button.configure(text=self._t('save_results_button'))
            self.data_management_title_label.configure(text=self._t('data_management_title'))
            self.import_button.configure(text=self._t('import_button'))
            self.export_data_button.configure(text=self._t('export_data_button'))
            rtl = (lang == 'fa')
            anchor_opt = tk.E if rtl else tk.W
            justify_opt = tk.RIGHT if rtl else tk.LEFT
            self.add_data_title_label.configure(text=self._t('add_data_title'), anchor=anchor_opt)
            self.add_data_hint_label.configure(text=self._t('add_data_hint'), anchor=anchor_opt)
            self.value_entry.configure(placeholder_text=self._t('add_data_placeholder'), justify=justify_opt)
            self.add_button.configure(text=self._t('add_button'))
            self.edit_delete_title_label.configure(text=self._t('edit_delete_title'), anchor=anchor_opt)
            self.edit_value_entry.configure(placeholder_text=self._t('edit_placeholder'), justify=justify_opt)
            self.save_edit_button.configure(text=self._t('save_button'))
            self.delete_button.configure(text=self._t('delete_button'))
            self.rf_title_label.configure(text=self._t('rf_title'), anchor=anchor_opt)
            self.rf_entry.configure(placeholder_text=self._t('rf_placeholder'), justify=justify_opt)
            self.data_list_title_label.configure(text=self._t('data_list_title'), anchor=anchor_opt)
            self.clear_list_button.configure(text=self._t('clear_list_button'))
            self.calculate_button.configure(text=self._t('calculate_button'))
            self.plot_hist_button.configure(text=self._t('plot_hist_button'))
            self.plot_box_button.configure(text=self._t('plot_box_button'))
            self.plot_equity_button.configure(text=self._t('plot_equity_button'))
            self.plot_qq_button.configure(text=self._t('plot_qq_button'))
            self.update_edit_options()
            self.count_label.configure(anchor = anchor_opt)
            for key in self.result_labels:
                if isinstance(self.result_labels[key], ctk.CTkLabel) and self.result_labels[key].winfo_exists():
                    self.result_labels[key].configure(anchor = anchor_opt)
            self.update_data_display()
        except tk.TclError: pass
        except Exception as e: print(f"Unexpected error during language update: {e}")

    def show_tooltip(self, widget, tooltip_key):
        if self._is_closing: return
        try:
            if not widget.winfo_exists(): return
        except tk.TclError: return
        if self.tooltip_window and self.tooltip_window.winfo_exists(): self.hide_tooltip()
        text = self._t(tooltip_key)
        if not text or text == tooltip_key: return
        try:
            x = widget.winfo_rootx() + widget.winfo_width() + 5
            y = widget.winfo_rooty()
            self.tooltip_window = Toplevel(self)
            self.tooltip_window.wm_overrideredirect(True)
            self.tooltip_window.wm_geometry(f"+{x}+{y}")
            self.tooltip_window.attributes("-topmost", True)
            # Use CTkFrame for tooltip background consistent with app theme
            tooltip_frame = ctk.CTkFrame(self.tooltip_window, corner_radius=6)
            tooltip_frame.pack()
            label = ctk.CTkLabel(tooltip_frame, text=text, font=self.tooltip_text_font, justify=tk.RIGHT if self.current_lang == 'fa' else tk.LEFT, corner_radius=6, padx=10, pady=6)
            label.pack(ipadx=1, ipady=1)
        except tk.TclError as e:
            if self.tooltip_window:
                try: self.tooltip_window.destroy()
                except: pass
            self.tooltip_window = None

    def hide_tooltip(self):
        if self.tooltip_window:
            try:
                if self.tooltip_window.winfo_exists(): self.tooltip_window.destroy()
            except tk.TclError: pass
            finally: self.tooltip_window = None

    def create_result_label_with_tooltip(self, parent, label_key, tooltip_key, bold_value=False):
        container = ctk.CTkFrame(parent, fg_color="transparent")
        container.pack(pady=(2,0), padx=15, fill="x")
        title_lbl = ctk.CTkLabel(container, text=f"{self._t(label_key)}:", font=self.result_label_font, anchor="w")
        title_lbl.pack(side=tk.LEFT, padx=(5,5))
        self.title_labels[label_key + "_title"] = title_lbl
        value_font = self.result_value_font if bold_value else self.result_label_font
        value_lbl = ctk.CTkLabel(container, text="-", font=value_font, anchor="w")
        value_lbl.pack(side=tk.LEFT, padx=(0,10))
        self.result_labels[label_key] = value_lbl
        if tooltip_key:
            icon = ctk.CTkLabel(container, text="\u24D8", font=self.tooltip_icon_font, cursor="hand2", text_color="gray") # Tooltip icon color
            icon.pack(side=tk.LEFT, padx=(0, 5))
            icon.bind("<Enter>", lambda e, w=icon, tk_key=tooltip_key: self.show_tooltip(w, tk_key), add="+")
            icon.bind("<Leave>", lambda e: self.hide_tooltip(), add="+")
        return value_lbl

    def create_rf_input_with_tooltip(self, parent, label_key, tooltip_key):
        input_frame = ctk.CTkFrame(parent, fg_color="transparent")
        input_frame.pack(pady=(2, 5), padx=10, fill="x")
        self.rf_title_label = ctk.CTkLabel(input_frame, text="", font=self.header_font, anchor="e")
        self.rf_title_label.pack(side="right", padx=(10,0))
        self.rf_entry = ctk.CTkEntry(input_frame, placeholder_text="", font=self.entry_font, justify='right', width=90)
        self.rf_entry.insert(0, "2.0")
        self.rf_entry.pack(side="right", padx=(5, 0), ipady=3)
        if tooltip_key:
            icon = ctk.CTkLabel(input_frame, text="\u24D8", font=self.tooltip_icon_font, cursor="hand2", text_color="gray") # Tooltip icon color
            icon.pack(side="right", padx=(5, 0))
            icon.bind("<Enter>", lambda e, w=icon, tk_key=tooltip_key: self.show_tooltip(w, tk_key), add="+")
            icon.bind("<Leave>", lambda e: self.hide_tooltip(), add="+")

    def update_status(self, message_key, **kwargs):
        if self._is_closing: return
        message = self._t(message_key, **kwargs)
        try:
            if self.status_bar.winfo_exists(): self.status_bar.configure(text=message)
        except tk.TclError: pass

    # --- Data Handling Functions (add_data_point, update_data_display, etc.) ---
    # (بدون تغییر نسبت به نسخه قبل)
    def add_data_point_event(self, event): self.add_data_point()
    def add_data_point(self):
        if self._is_closing: return
        try: raw_input = self.value_entry.get()
        except tk.TclError: return
        if not raw_input.strip():
            messagebox.showwarning(self._t('warning_title'), self._t('status_empty_input'))
            self.update_status('status_empty_input')
            try: self.value_entry.focus()
            except tk.TclError: pass
            return
        potential_values = [val for val in re.split(r'[,\n\s]+', raw_input) if val]
        added_count = 0; invalid_entries = []; newly_added_data = []
        for raw_val in potential_values:
            cleaned_value = raw_val.strip().replace('%', '')
            if not cleaned_value: continue
            try:
                value = float(cleaned_value)
                if not math.isfinite(value): invalid_entries.append(raw_val); continue
                newly_added_data.append(value); added_count += 1
            except ValueError: invalid_entries.append(raw_val)
        if added_count > 0:
            self.data_points.extend(newly_added_data); self.update_data_display()
            self.update_edit_options(); self.reset_results(); self._update_action_buttons_state()
            status_key = 'status_data_added'; status_args = {'count': added_count}
            if invalid_entries:
                status_key = 'status_data_invalid'; entries_str = f"{', '.join(invalid_entries[:3])}{'...' if len(invalid_entries)>3 else ''}"
                status_args['entries'] = entries_str
                messagebox.showwarning(self._t('warning_title'), self._t(status_key, **status_args))
            self.update_status(status_key, **status_args)
        elif invalid_entries:
            messagebox.showerror(self._t('error_title'), self._t('status_no_valid_data'))
            self.update_status('status_no_valid_data')
        try:
            self.value_entry.delete(0, "end"); self.value_entry.focus()
        except tk.TclError: pass
        self._update_edit_controls_state()
    def update_data_display(self):
        if self._is_closing: return
        try:
            if not self.data_display_textbox.winfo_exists(): return
            self.data_display_textbox.configure(state="normal"); self.data_display_textbox.delete("1.0", "end")
            display_lines = [f"{i+1}. {p:.4f}" for i, p in enumerate(self.data_points)]
            display_text = "\n".join(display_lines)
            self.data_display_textbox.insert("1.0", display_text); self.data_display_textbox.configure(state="disabled")
        except tk.TclError: pass
    def update_edit_options(self):
        if self._is_closing: return
        try:
            if not self.edit_optionmenu.winfo_exists(): return
            if not self.data_points:
                options = [self._t('list_empty_option')]; self.edit_option_var.set(options[0])
            else:
                options = [self._t('data_option_format', index=i+1, value=p) for i,p in enumerate(self.data_points)]
                current_selection_index = self.selected_edit_index.get()
                if 0 <= current_selection_index < len(self.data_points):
                    current_option_string = self._t('data_option_format', index=current_selection_index + 1, value=self.data_points[current_selection_index])
                    if current_option_string in options: self.edit_option_var.set(current_option_string)
                    else: self.edit_option_var.set(self._t('select_option')); self.selected_edit_index.set(-1)
                else:
                     self.edit_option_var.set(self._t('select_option'))
                     if current_selection_index != -1: self.selected_edit_index.set(-1)
            self.edit_optionmenu.configure(values=options if options else [""])
        except tk.TclError: pass
        except IndexError:
            if hasattr(self, 'edit_optionmenu') and self.edit_optionmenu.winfo_exists(): self.edit_option_var.set(self._t('select_option'))
            self.selected_edit_index.set(-1)
        except Exception as e: print(f"Unexpected error in update_edit_options: {e}")
    def _update_edit_controls_state(self):
        if self._is_closing: return
        try:
            has_data = bool(self.data_points)
            item_selected = (self.selected_edit_index.get() != -1 and 0 <= self.selected_edit_index.get() < len(self.data_points) )
            if hasattr(self, 'edit_optionmenu') and self.edit_optionmenu.winfo_exists():
                self.edit_optionmenu.configure(state="normal" if has_data else "disabled")
                if not has_data: self.edit_option_var.set(self._t('list_empty_option'))
                elif not item_selected: self.edit_option_var.set(self._t('select_option'))
            if hasattr(self, 'edit_value_entry') and self.edit_value_entry.winfo_exists(): self.edit_value_entry.configure(state="normal" if item_selected else "disabled")
            if hasattr(self, 'save_edit_button') and self.save_edit_button.winfo_exists(): self.save_edit_button.configure(state="normal" if item_selected else "disabled")
            if hasattr(self, 'delete_button') and self.delete_button.winfo_exists(): self.delete_button.configure(state="normal" if item_selected else "disabled")
        except tk.TclError: pass
        except IndexError:
             self.selected_edit_index.set(-1)
             if hasattr(self, 'edit_value_entry') and self.edit_value_entry.winfo_exists(): self.edit_value_entry.configure(state="disabled")
             if hasattr(self, 'save_edit_button') and self.save_edit_button.winfo_exists(): self.save_edit_button.configure(state="disabled")
             if hasattr(self, 'delete_button') and self.delete_button.winfo_exists(): self.delete_button.configure(state="disabled")
             if hasattr(self, 'edit_optionmenu') and self.edit_optionmenu.winfo_exists(): self.edit_option_var.set(self._t('select_option'))
        except Exception as e: print(f"Unexpected error in _update_edit_controls_state: {e}")
    def load_value_for_edit_from_menu(self, selected_option_string: str):
        if self._is_closing: return
        if selected_option_string in [self._t('list_empty_option'), self._t('select_option')]:
             self.selected_edit_index.set(-1)
             try:
                 if hasattr(self, 'edit_value_entry') and self.edit_value_entry.winfo_exists(): self.edit_value_entry.delete(0, "end")
             except tk.TclError: pass
             self._update_edit_controls_state(); return
        try:
            match = re.match(r"^[^\d]*(\d+)", selected_option_string)
            if match:
                index = int(match.group(1)) - 1
                if 0 <= index < len(self.data_points): self.load_value_for_edit_from_index(index)
                else: messagebox.showerror(self._t('error_title'), f"Internal error: Invalid index {index+1} selected."); self.selected_edit_index.set(-1)
            else: messagebox.showerror(self._t('error_title'), "Internal error: Could not parse selected item."); self.selected_edit_index.set(-1)
        except (ValueError, IndexError, AttributeError) as e: messagebox.showerror(self._t('error_title'), f"Internal error parsing selection: {e}"); self.selected_edit_index.set(-1)
        self._update_edit_controls_state()
    def load_value_for_edit_from_index(self, index: int):
        if self._is_closing: return
        if 0 <= index < len(self.data_points):
             self.selected_edit_index.set(index); value_to_edit = self.data_points[index]
             try:
                 if hasattr(self, 'edit_value_entry') and self.edit_value_entry.winfo_exists():
                     self.edit_value_entry.configure(state="normal"); self.edit_value_entry.delete(0, "end")
                     self.edit_value_entry.insert(0, f"{value_to_edit:.4f}"); self.edit_value_entry.focus()
                 else: return
                 if hasattr(self, 'save_edit_button') and self.save_edit_button.winfo_exists(): self.save_edit_button.configure(state="normal")
                 if hasattr(self, 'delete_button') and self.delete_button.winfo_exists(): self.delete_button.configure(state="normal")
             except tk.TclError: pass
        else: self.selected_edit_index.set(-1); self._update_edit_controls_state()
    def save_edited_value_event(self, event): self.save_edited_value()
    def save_edited_value(self):
        if self._is_closing: return
        index = self.selected_edit_index.get()
        if index == -1 or not (0 <= index < len(self.data_points)): messagebox.showwarning(self._t('warning_title'), self._t('status_select_edit')); return
        try: new_val_str = self.edit_value_entry.get().strip().replace('%', '')
        except tk.TclError: return
        if not new_val_str: messagebox.showwarning(self._t('warning_title'), self._t('status_edit_empty')); return
        try:
            new_val = float(new_val_str)
            if not math.isfinite(new_val): messagebox.showerror(self._t('error_title'), self._t('status_edit_invalid')); return
            if not (0 <= index < len(self.data_points)): raise IndexError("Index became invalid before saving.")
            old_val = self.data_points[index]; self.data_points[index] = new_val
            self.update_data_display(); self.update_edit_options(); self.reset_results()
            self._update_action_buttons_state(); self.update_status('status_data_edited', index=index+1, old_val=f"{old_val:.2f}", new_val=f"{new_val:.2f}")
            try: self.edit_value_entry.focus()
            except tk.TclError: pass
        except ValueError: messagebox.showerror(self._t('error_title'), self._t('status_edit_invalid'))
        except IndexError: messagebox.showerror(self._t('error_title'), self._t('status_edit_index_error')); self.selected_edit_index.set(-1); self._update_edit_controls_state()
        except tk.TclError: pass
    def delete_selected_data(self):
        if self._is_closing: return
        index = self.selected_edit_index.get()
        if index == -1 or not (0 <= index < len(self.data_points)): messagebox.showwarning(self._t('warning_title'), self._t('status_select_delete')); return
        try:
            if not (0 <= index < len(self.data_points)): raise IndexError("Index became invalid before deleting.")
            val = self.data_points.pop(index); self.selected_edit_index.set(-1)
            try:
                 if hasattr(self, 'edit_value_entry') and self.edit_value_entry.winfo_exists(): self.edit_value_entry.delete(0, "end")
            except tk.TclError: pass
            self.update_data_display(); self.update_edit_options(); self.reset_results()
            self._update_edit_controls_state(); self._update_action_buttons_state()
            self.update_status('status_data_deleted', index=index+1, val=f"{val:.2f}")
        except IndexError: messagebox.showerror(self._t('error_title'), self._t('status_delete_index_error')); self.selected_edit_index.set(-1); self._update_edit_controls_state()
        except tk.TclError: pass
    def clear_data_list(self):
        if self._is_closing: return
        if not self.data_points: return
        self.data_points = []; self.calculated_results = {}
        self.update_data_display(); self.update_edit_options(); self.reset_results()
        self.selected_edit_index.set(-1)
        try:
            if hasattr(self, 'edit_value_entry') and self.edit_value_entry.winfo_exists(): self.edit_value_entry.delete(0,"end")
        except tk.TclError: pass
        self._update_edit_controls_state(); self._update_action_buttons_state(); self.update_status('status_list_cleared')
        try:
            if hasattr(self, 'value_entry') and self.value_entry.winfo_exists(): self.value_entry.focus()
        except tk.TclError: pass
    def reset_results(self):
        if self._is_closing: return
        self.calculated_results = {}
        try:
            if hasattr(self, 'count_label') and self.count_label.winfo_exists(): self.count_label.configure(text=f"{self._t('data_count')}: -")
            for key, label_widget in self.result_labels.items():
                if isinstance(label_widget, ctk.CTkLabel) and label_widget.winfo_exists(): label_widget.configure(text="-")
            if hasattr(self, 'export_button') and self.export_button.winfo_exists(): self.export_button.configure(state="disabled")
        except tk.TclError: pass
    def _update_action_buttons_state(self):
        if self._is_closing: return
        try:
            has_data = len(self.data_points) >= 1; has_enough_data_for_calc = len(self.data_points) >= 2; has_results = bool(self.calculated_results)
            widgets_to_update = {'calculate_button': "normal" if has_enough_data_for_calc else "disabled", 'plot_hist_button': "normal" if has_data else "disabled", 'plot_box_button': "normal" if has_data else "disabled", 'plot_equity_button': "normal" if has_data else "disabled", 'plot_qq_button': "normal" if has_data else "disabled", 'export_button': "normal" if has_results else "disabled", 'export_data_button': "normal" if has_data else "disabled"}
            for widget_name, state in widgets_to_update.items():
                 if hasattr(self, widget_name):
                      widget = getattr(self, widget_name)
                      if widget and widget.winfo_exists(): widget.configure(state=state)
        except tk.TclError: pass
        except Exception as e: print(f"Unexpected error in _update_action_buttons_state: {e}")

    # --- Calculation Functions (_calculate_mdd, calculate_metrics) ---
    # (بدون تغییر نسبت به نسخه قبل)
    def _calculate_mdd(self, returns_perc):
        if not isinstance(returns_perc, (list, np.ndarray)) or len(returns_perc) == 0: return np.nan, np.nan, np.nan
        data_arr = np.array(returns_perc)
        if not np.all(np.isfinite(data_arr)):
             print("Warning: Non-finite values found in returns for MDD calculation. Filtering.")
             data_arr = data_arr[np.isfinite(data_arr)]
             if data_arr.size == 0: return np.nan, np.nan, np.nan
        comp_ret = 1 + data_arr / 100.0; cum_ret_with_start = np.insert(np.cumprod(comp_ret), 0, 1.0)
        running_max = np.maximum.accumulate(cum_ret_with_start)
        with np.errstate(divide='ignore', invalid='ignore'): drawdown = np.where(running_max <= 1e-9, 0, (cum_ret_with_start - running_max) / running_max * 100)
        drawdown[~np.isfinite(drawdown)] = 0
        if drawdown.size == 0: return np.nan, np.nan, np.nan
        max_dd = np.min(drawdown); end_index = np.argmin(drawdown)
        start_index = np.argmax(running_max[:end_index + 1]) if end_index > 0 else 0
        duration = end_index - start_index
        return max_dd, float(duration), end_index
    def calculate_metrics(self):
        if self._is_closing: return
        n_initial = len(self.data_points)
        if n_initial < 2: messagebox.showwarning(self._t('warning_title'), self._t('status_need_data_calc')); self.reset_results(); return
        self.update_status('status_calculating'); self.calculated_results = {'n_initial': n_initial}
        try:
            rf_str = self.rf_entry.get().strip().replace('%', '') or "0.0"; rf = float(rf_str)
            if not math.isfinite(rf): raise ValueError("RF Rate is not finite")
            self.calculated_results['rf'] = rf
        except ValueError: messagebox.showerror(self._t('error_title'), self._t('status_rf_error')); self.update_status('status_rf_error'); return
        except tk.TclError: return
        data = np.array(self.data_points); finite_mask = np.isfinite(data); n_finite = np.sum(finite_mask)
        if n_finite != n_initial:
             print(f"Warning: Ignoring {n_initial - n_finite} non-finite values."); data = data[finite_mask]
             if n_finite < 2: messagebox.showerror(self._t('error_title'), f"Not enough finite data points ({n_finite}) for calculation."); self.reset_results(); return
        self.calculated_results['data'] = data; self.calculated_results['n'] = n = n_finite
        mean = np.mean(data) if n > 0 else np.nan; std = np.std(data, ddof=1) if n > 1 else np.nan
        var = np.var(data, ddof=1) if n > 1 else np.nan; median = np.median(data) if n > 0 else np.nan
        self.calculated_results.update({'mean': mean, 'std': std, 'var': var, 'median': median})
        ci_l, ci_u = np.nan, np.nan
        if n > 1 and not np.isnan(std) and std > 1e-9:
            try:
                with np.errstate(invalid='ignore'): ci_l, ci_u = t.interval(confidence=0.95, df=n-1, loc=mean, scale=std / np.sqrt(n))
                if not (math.isfinite(ci_l) and math.isfinite(ci_u)): ci_l, ci_u = np.nan, np.nan
            except Exception: ci_l, ci_u = np.nan, np.nan
        self.calculated_results['ci'] = (ci_l, ci_u); ci_s = f"[{ci_l:.2f}, {ci_u:.2f}]" if not np.isnan(ci_l) else self._t('na_value')
        gm = np.nan
        if n > 0:
            growth_factors = 1 + data / 100.0
            if np.all(growth_factors > 1e-9) and np.all(np.isfinite(growth_factors)):
                try: gm = (gmean(growth_factors) - 1) * 100
                except ValueError: pass
                if not math.isfinite(gm): gm = np.nan
        self.calculated_results['gm'] = gm; gm_s = f"{gm:.2f}%" if not np.isnan(gm) else self._t('na_value')
        dsd = np.nan
        if n > 0:
            downside_returns = data[data < 0]
            if downside_returns.size > 0 and n > 1:
                sum_sq_down = np.sum(downside_returns**2); dsd = np.sqrt(sum_sq_down / (n - 1))
                if not math.isfinite(dsd): dsd = np.nan
            elif n >= 1: dsd = 0.0
        self.calculated_results['dsd'] = dsd; dsd_s = f"{dsd:.2f}%" if not np.isnan(dsd) else self._t('na_value')
        cv = np.nan
        if not np.isnan(mean) and abs(mean) > 1e-9 and not np.isnan(std):
             cv = std / mean
             if not math.isfinite(cv): cv = np.nan
        self.calculated_results['cv'] = cv; cv_s = f"{cv:.3f}" if not np.isnan(cv) else self._t('na_value')
        mdd, mdd_dur, _ = self._calculate_mdd(data); self.calculated_results.update({'mdd': mdd, 'mdd_period': mdd_dur})
        mdd_s = f"{mdd:.2f}%" if not np.isnan(mdd) else self._t('na_value'); mdd_dur_s = f"{int(mdd_dur)}" if not np.isnan(mdd_dur) else self._t('na_value')
        sk, ku = np.nan, np.nan
        if n > 2 and not np.isnan(std) and std > 1e-9:
             sk = skew(data); ku = kurtosis(data, fisher=True)
             if not math.isfinite(sk): sk = np.nan;
             if not math.isfinite(ku): ku = np.nan
        elif n > 0 and (np.isnan(std) or std <= 1e-9): sk, ku = 0.0, -3.0
        self.calculated_results.update({'skew': sk, 'kurt': ku}); sk_s = f"{sk:.3f}" if not np.isnan(sk) else self._t('na_value'); ku_s = f"{ku:.3f}" if not np.isnan(ku) else self._t('na_value')
        shap_w, shap_p = np.nan, np.nan; normality_s = self._t('na_value')
        if n >= 3:
            if not np.isnan(std) and std > 1e-9:
                try:
                    shap_w, shap_p = shapiro(data)
                    if not (math.isfinite(shap_w) and math.isfinite(shap_p)): shap_w, shap_p = np.nan, np.nan
                    if not np.isnan(shap_w): normality_s = f"W={shap_w:.3f}, p={shap_p:.3f}"
                    else: normality_s = "Test Failed"
                except Exception: normality_s = "Test Failed"
            else: normality_s = "Constant Data"
        elif n > 0: normality_s = "Need n>=3"
        self.calculated_results.update({'shap_w': shap_w, 'shap_p': shap_p})
        var5, var95 = np.nan, np.nan
        if n > 0: var5 = np.percentile(data, 5); var95 = np.percentile(data, 95);
        if not math.isfinite(var5): var5 = np.nan
        if not math.isfinite(var95): var95 = np.nan
        self.calculated_results.update({'var5': var5, 'var95': var95}); var5_s = f"{var5:.2f}%" if not np.isnan(var5) else self._t('na_value'); var95_s = f"{var95:.2f}%" if not np.isnan(var95) else self._t('na_value')
        max_gain = np.nan
        if n > 0: max_gain = np.max(data);
        if not math.isfinite(max_gain): max_gain = np.nan
        self.calculated_results['max_gain'] = max_gain; max_gain_s = f"{max_gain:.2f}%" if not np.isnan(max_gain) else self._t('na_value')
        sh = np.nan
        if not np.isnan(mean) and not np.isnan(std) and abs(std) > 1e-9 and not np.isnan(rf):
             sh = (mean - rf) / std
             if not math.isfinite(sh): sh = np.nan
        self.calculated_results['sh'] = sh; sh_s = f"{sh:.3f}" if not np.isnan(sh) else self._t('na_value')
        so = np.nan; so_s = self._t('na_value')
        if not np.isnan(mean) and not np.isnan(dsd) and not np.isnan(rf):
            if abs(dsd) > 1e-9:
                 so = (mean - rf) / dsd
                 if not math.isfinite(so): so = np.nan
                 if not np.isnan(so): so_s = f"{so:.3f}"
            elif dsd == 0.0:
                 if (mean - rf) > 1e-9: so_s = "∞"
                 elif (mean - rf) < -1e-9: so_s = "-∞"
        self.calculated_results['so'] = so
        try:
            if hasattr(self, 'count_label') and self.count_label.winfo_exists(): self.count_label.configure(text=f"{self._t('data_count')}: {n}")
            def safe_update_label(label_key, text_value):
                 widget = self.result_labels.get(label_key)
                 if widget and isinstance(widget, ctk.CTkLabel) and widget.winfo_exists(): widget.configure(text=text_value)
            safe_update_label('mean_label', f"{mean:.2f}%" if not np.isnan(mean) else self._t('na_value'))
            safe_update_label('ci_label', ci_s); safe_update_label('geo_mean_label', gm_s)
            safe_update_label('std_dev_label', f"{std:.2f}%" if not np.isnan(std) else self._t('na_value'))
            safe_update_label('downside_dev_label', dsd_s); safe_update_label('variance_label', f"{var:.2f}" if not np.isnan(var) else self._t('na_value'))
            safe_update_label('cv_label', cv_s); safe_update_label('mdd_label', mdd_s); safe_update_label('mdd_period_label', mdd_dur_s)
            safe_update_label('skewness_label', sk_s); safe_update_label('kurtosis_label', ku_s)
            safe_update_label('normality_label', normality_s); safe_update_label('var_label', var5_s)
            safe_update_label('var_95_label', var95_s); safe_update_label('max_gain_label', max_gain_s)
            safe_update_label('sharpe_label', sh_s); safe_update_label('sortino_label', so_s)
            self._update_action_buttons_state(); self.update_status('status_calc_done')
        except tk.TclError: pass

    # --- Plotting Functions ---
    def _create_plot_window(self, title_key):
        if self._is_closing: return None, None
        plot_window = None
        try:
             window_id = f"plot_{title_key}_{pd.Timestamp.now().strftime('%H%M%S%f')}"
             plot_window = ctk.CTkToplevel(self)
             plot_window.configure(fg_color=DARK_BACKGROUND_COLOR) # <- رنگ پس‌زمینه پنجره پلات
             plot_window.title(self._reshape_fa(self._t(title_key)))
             plot_window.geometry("800x600"); plot_window.transient(self); plot_window.grab_set()
             self._active_plot_windows[window_id] = plot_window
             def on_plot_close(win_id=window_id):
                 if win_id in self._active_plot_windows: del self._active_plot_windows[win_id]
                 try:
                     if plot_window.winfo_exists(): plot_window.destroy()
                 except tk.TclError: pass
                 except Exception as e: print(f"Error destroying plot window {win_id}: {e}")
             plot_window.protocol("WM_DELETE_WINDOW", on_plot_close)
             # Frame داخلی هم رنگ پس‌زمینه تیره می‌گیرد
             content_frame = ctk.CTkFrame(plot_window, fg_color=DARK_BACKGROUND_COLOR)
             content_frame.pack(fill=tk.BOTH, expand=True, padx=5, pady=5) # Padding کمتر
             return plot_window, content_frame, window_id
        except tk.TclError: return None, None, None
        except Exception as e:
             print(f"Error creating plot window: {e}")
             if plot_window and plot_window.winfo_exists():
                 try: plot_window.destroy()
                 except: pass
             return None, None, None

    def _embed_plot(self, fig, parent_frame, window_id):
        if self._is_closing or not parent_frame or not parent_frame.winfo_exists():
             if fig: plt.close(fig)
             return None
        canvas = None
        try:
            # --- مهم: تنظیم رنگ پس‌زمینه فیگور قبل از ایجاد Canvas ---
            fig.patch.set_facecolor(DARK_BACKGROUND_COLOR)

            canvas = FigureCanvasTkAgg(fig, master=parent_frame)
            canvas_widget = canvas.get_tk_widget()
            # --- مهم: تنظیم رنگ پس‌زمینه ویجت Canvas ---
            canvas_widget.config(bg=DARK_BACKGROUND_COLOR)
            canvas_widget.pack(side=tk.TOP, fill=tk.BOTH, expand=True)
            canvas.draw()

            # --- استایل تولبار ---
            toolbar_frame = tk.Frame(master=parent_frame, background=DARK_BACKGROUND_COLOR) # <- پس‌زمینه تولبار
            toolbar_frame.pack(side=tk.BOTTOM, fill=tk.X)
            toolbar = NavigationToolbar2Tk(canvas, toolbar_frame)

            # --- مهم: تنظیم رنگ دکمه‌ها و عناصر تولبار ---
            toolbar.config(background=DARK_BACKGROUND_COLOR)
            toolbar._message_label.config(background=DARK_BACKGROUND_COLOR, foreground=DARK_TEXT_COLOR)
            for button in toolbar.winfo_children():
                if isinstance(button, (tk.Button, ctk.CTkButton)):
                    button.config(background=DARK_BACKGROUND_COLOR, foreground=DARK_TEXT_COLOR, relief=tk.FLAT)
                elif isinstance(button, tk.Label): # Handle potential labels in toolbar
                     button.config(background=DARK_BACKGROUND_COLOR, foreground=DARK_TEXT_COLOR)

            toolbar.update()
            return canvas

        except tk.TclError as e:
             if fig: plt.close(fig)
             if window_id in self._active_plot_windows:
                 try:
                     win = self._active_plot_windows[window_id]
                     if win and win.winfo_exists(): win.destroy()
                     del self._active_plot_windows[window_id]
                 except: pass
             return None
        except Exception as e:
             print(f"Unexpected error embedding plot {window_id}: {e}")
             if fig: plt.close(fig)
             return None

    def _plot_action_wrapper(self, plot_func, title_key):
        if self._is_closing: return
        if not self.data_points: messagebox.showwarning(self._t('warning_title'), self._t('status_need_data_plot')); return
        if not self.calculated_results and plot_func.__name__ != 'plot_equity_curve_logic':
             print("Calculating metrics before plotting...")
             self.calculate_metrics()
             if not self.calculated_results: print("Plot cancelled because metric calculation failed."); return
        data = self.calculated_results.get('data', np.array(self.data_points))
        if plot_func.__name__ == 'plot_qqplot_logic' and len(data) < 2: messagebox.showinfo(self._t('info_title'), "QQ-Plot requires at least 2 finite data points."); return
        if len(data) == 0: messagebox.showwarning(self._t('warning_title'), "No finite data points available to plot."); return
        status_map = {'plot_histogram_logic': 'status_plotting_hist', 'plot_boxplot_logic': 'status_plotting_box', 'plot_equity_curve_logic': 'status_plotting_equity', 'plot_qqplot_logic': 'status_plotting_qq'}
        self.update_status(status_map.get(plot_func.__name__, 'status_plotting_hist'))
        fig = None; plot_window = None; window_id = None
        try:
            plot_window, content_frame, window_id = self._create_plot_window(title_key)
            if not plot_window: return
            fig, ax = plot_func(data) # Call the specific plot function
            if fig and ax:
                # --- تنظیم رنگ پس‌زمینه به طور صریح ---
                fig.patch.set_facecolor(DARK_BACKGROUND_COLOR)
                ax.set_facecolor(DARK_AXES_COLOR)

                # --- تنظیم رنگ محورها و تیک‌ها ---
                ax.spines['bottom'].set_color(DARK_GRID_COLOR)
                ax.spines['top'].set_color(DARK_GRID_COLOR)
                ax.spines['right'].set_color(DARK_GRID_COLOR)
                ax.spines['left'].set_color(DARK_GRID_COLOR)
                ax.tick_params(axis='x', colors=DARK_TEXT_COLOR)
                ax.tick_params(axis='y', colors=DARK_TEXT_COLOR)

                fig.tight_layout(pad=1.5)
                self._embed_plot(fig, content_frame, window_id)
                self.update_status('status_plot_done')
            else: raise ValueError("Plot generation failed internally.")
        except Exception as e:
            error_msg = f"{self._t('status_plot_error', error=str(e))}"
            print(f"Plotting Error: {e}") # Log detailed error
            messagebox.showerror(self._t('error_title'), error_msg)
            self.update_status('status_plot_error', error=str(e))
            if fig: plt.close(fig)
            if window_id and window_id in self._active_plot_windows:
                 try:
                     win = self._active_plot_windows[window_id]
                     if win and win.winfo_exists(): win.destroy()
                     del self._active_plot_windows[window_id]
                 except: pass

    def plot_histogram_logic(self, data):
        n = len(data)
        mean = self.calculated_results.get('mean', np.nan)
        median = self.calculated_results.get('median', np.nan)
        std = self.calculated_results.get('std', np.nan)
        var_5 = self.calculated_results.get('var5', np.nan)
        var_95 = self.calculated_results.get('var95', np.nan)

        fig, ax = plt.subplots(figsize=(8.5, 5.5), dpi=100)
        # تنظیم رنگ پس‌زمینه در wrapper انجام می‌شود

        hist_color = DARK_LINE_COLOR_SECONDARY # آبی
        kde_color = '#ff7f0e'  # نارنجی روشن برای KDE
        norm_fit_color = '#aec7e8' # آبی-خاکستری روشن برای نرمال فیت

        counts, bins, patches = ax.hist(data, bins='auto', alpha=0.75, label='_nolegend_', density=False, color=hist_color)

        if not np.isnan(var_5) and not np.isnan(var_95):
            for patch, bin_left, bin_right in zip(patches, bins[:-1], bins[1:]):
                if bin_right <= var_5: patch.set_facecolor(DARK_HIGHLIGHT_COLOR_NEG); patch.set_alpha(0.8)
                elif bin_left >= var_95: patch.set_facecolor(DARK_HIGHLIGHT_COLOR_POS); patch.set_alpha(0.8)

        if n > 1 and not np.isnan(std) and std > 1e-9 :
            sns.kdeplot(data, color=kde_color, linewidth=1.8, label=self._reshape_fa(self._t('plot_kde_label')), ax=ax)

        line_alpha = 0.95; var_line_style = ':'; var_line_width = 2.0
        if not np.isnan(mean): ax.axvline(mean, color=DARK_HIGHLIGHT_COLOR_MEAN, linestyle='--', linewidth=1.8, alpha=line_alpha, label=self._reshape_fa(self._t('plot_mean_label', val=mean)))
        if not np.isnan(median): ax.axvline(median, color=DARK_HIGHLIGHT_COLOR_MEDIAN, linestyle='-', linewidth=1.8, alpha=line_alpha, label=self._reshape_fa(self._t('plot_median_label', val=median)))
        if not np.isnan(var_5): ax.axvline(var_5, color=DARK_HIGHLIGHT_COLOR_NEG, linestyle=var_line_style, linewidth=var_line_width, alpha=line_alpha, label=self._reshape_fa(self._t('plot_var_label', val=var_5)))
        if not np.isnan(var_95): ax.axvline(var_95, color=DARK_HIGHLIGHT_COLOR_POS, linestyle=var_line_style, linewidth=var_line_width, alpha=line_alpha, label=self._reshape_fa(self._t('plot_gain_label', val=var_95)))

        if not np.isnan(mean) and not np.isnan(std) and std > 1e-9:
            xmin, xmax = ax.get_xlim(); x = np.linspace(xmin, xmax, 100)
            try:
                p = norm.pdf(x, mean, std); bin_width = bins[1] - bins[0] if len(bins) > 1 else 1
                scale_factor = n * bin_width
                ax.plot(x, p * scale_factor, color=norm_fit_color, linestyle=':', linewidth=1.5, alpha=0.8, label=self._reshape_fa(self._t('plot_norm_label', mean=mean, std=std)))
            except Exception: pass

        ax.set_title(self._reshape_fa(self._t('plot_hist_title')), color=DARK_TEXT_COLOR)
        ax.set_xlabel(self._reshape_fa(self._t('plot_xlabel')), color=DARK_TEXT_COLOR)
        ax.set_ylabel(self._reshape_fa(self._t('plot_ylabel_hist')), color=DARK_TEXT_COLOR)
        ax.legend(fontsize='small', labelcolor=DARK_TEXT_COLOR) # <- رنگ متن لجند
        ax.grid(True, color=DARK_GRID_COLOR, linestyle=':', linewidth=0.6, alpha=0.7)
        return fig, ax

    def plot_boxplot_logic(self, data):
        fig, ax = plt.subplots(figsize=(5.5, 6), dpi=100)
        # تنظیم رنگ پس‌زمینه در wrapper

        box_color = DARK_LINE_COLOR_SECONDARY # آبی
        flier_color = '#999999' # خاکستری متوسط
        point_color = '#729fcf' # آبی آسمانی روشن

        boxprops = dict(facecolor=box_color, alpha=0.7, edgecolor=DARK_TEXT_COLOR) # لبه جعبه روشن
        sns.boxplot(y=data, showmeans=True, meanline=True,
                    meanprops={'color': DARK_HIGHLIGHT_COLOR_MEAN, 'ls': '--', 'lw': 1.5},
                    medianprops={'color': DARK_HIGHLIGHT_COLOR_MEDIAN, 'ls': '-', 'lw': 1.5},
                    flierprops=dict(marker='.', markersize=4, alpha=0.6, markerfacecolor=flier_color, markeredgecolor=flier_color),
                    boxprops=boxprops,
                    whiskerprops={'color': DARK_TEXT_COLOR, 'linewidth': 1.2}, # ویسکر روشن
                    capprops={'color': DARK_TEXT_COLOR, 'linewidth': 1.2},   # کپ روشن
                    ax=ax)
        sns.stripplot(y=data, color=point_color, jitter=0.1, size=3.0, alpha=0.5, ax=ax)
        ax.set_title(self._reshape_fa(self._t('plot_box_title')), color=DARK_TEXT_COLOR)
        ax.set_ylabel(self._reshape_fa(self._t('plot_ylabel_box')), color=DARK_TEXT_COLOR)
        ax.set_xlabel("")
        ax.grid(True, axis='y', color=DARK_GRID_COLOR, linestyle=':', linewidth=0.6, alpha=0.7) # گرید افقی
        return fig, ax

    def plot_equity_curve_logic(self, data):
        initial_value = 1000
        returns_decimal = data / 100.0
        growth_factors = 1 + returns_decimal
        equity_curve = np.insert(np.cumprod(growth_factors), 0, 1) * initial_value

        fig, ax = plt.subplots(figsize=(9, 5.5), dpi=100)
        # تنظیم رنگ پس‌زمینه در wrapper

        line_color = DARK_LINE_COLOR_PRIMARY # سبز
        baseline_color = DARK_GRID_COLOR # خاکستری

        ax.plot(equity_curve, marker='.', linestyle='-', markersize=3, color=line_color, linewidth=1.8)
        ax.axhline(initial_value, color=baseline_color, linestyle=':', linewidth=1)
        ax.set_title(self._reshape_fa(self._t('plot_equity_title')), color=DARK_TEXT_COLOR)
        ax.set_xlabel(self._reshape_fa(self._t('plot_equity_xlabel')), color=DARK_TEXT_COLOR)
        ax.set_ylabel(self._reshape_fa(self._t('plot_equity_ylabel')), color=DARK_TEXT_COLOR)
        ax.ticklabel_format(style='plain', axis='y')
        ax.grid(True, color=DARK_GRID_COLOR, linestyle=':', linewidth=0.6, alpha=0.7)
        return fig, ax

    def plot_qqplot_logic(self, data):
        fig, ax = plt.subplots(figsize=(6, 6), dpi=100)
        # تنظیم رنگ پس‌زمینه در wrapper

        point_color = DARK_HIGHLIGHT_COLOR_MEDIAN # آبی آسمانی
        line_color = DARK_HIGHLIGHT_COLOR_NEG  # قرمز

        probplot_result = probplot(data, dist="norm", plot=ax)
        try:
             points, line = ax.get_lines()[:2]
             points.set_markerfacecolor(point_color); points.set_markeredgecolor(point_color)
             points.set_marker('.'); points.set_markersize(5); points.set_alpha(0.8)
             line.set_color(line_color); line.set_linestyle('--'); line.set_linewidth(1.5)
        except Exception: pass
        ax.set_title(self._reshape_fa(self._t('plot_qq_title')), color=DARK_TEXT_COLOR)
        ax.set_xlabel(self._reshape_fa(self._t('plot_qq_xlabel')), color=DARK_TEXT_COLOR)
        ax.set_ylabel(self._reshape_fa(self._t('plot_qq_ylabel')), color=DARK_TEXT_COLOR)
        ax.grid(True, color=DARK_GRID_COLOR, linestyle=':', linewidth=0.6, alpha=0.7)
        return fig, ax

    def plot_histogram_action(self): self._plot_action_wrapper(self.plot_histogram_logic, 'plot_hist_title')
    def plot_boxplot_action(self): self._plot_action_wrapper(self.plot_boxplot_logic, 'plot_box_title')
    def plot_equity_curve_action(self): self._plot_action_wrapper(self.plot_equity_curve_logic, 'plot_equity_title')
    def plot_qqplot_action(self): self._plot_action_wrapper(self.plot_qqplot_logic, 'plot_qq_title')

    # --- Import/Export Functions (export_results_to_txt, import_data_from_file, export_data_to_excel) ---
    # (بدون تغییر نسبت به نسخه قبل)
    def export_results_to_txt(self):
        if self._is_closing: return
        if not self.calculated_results: messagebox.showwarning(self._t('warning_title'), self._t('status_no_results')); return
        self.update_status('status_saving_results')
        lines = []
        try:
            def get_safe_text(widget):
                if widget and widget.winfo_exists(): return widget.cget("text")
                return "N/A"
            lines.append(f"========== {self._t('app_title')} ==========")
            lines.append(f"Date: {pd.Timestamp.now().strftime('%Y-%m-%d %H:%M:%S')}")
            lines.append("-" * 50); lines.append(self._t('results_title')); lines.append("-" * 50)
            lines.append(get_safe_text(getattr(self, 'count_label', None)))
            metric_order = ['mean_label', 'ci_label', 'geo_mean_label', 'std_dev_label', 'downside_dev_label', 'variance_label', 'cv_label', 'mdd_label', 'mdd_period_label', 'skewness_label', 'kurtosis_label', 'normality_label', 'var_label', 'var_95_label', 'max_gain_label', 'sharpe_label', 'sortino_label']
            for key in metric_order:
                title_text = get_safe_text(self.title_labels.get(key + "_title"))
                value_text = get_safe_text(self.result_labels.get(key))
                lines.append(f"{title_text} {value_text}")
            lines.append("-" * 50)
            rf_val = self.calculated_results.get('rf', np.nan)
            rf_val_str = f"{rf_val}%" if not np.isnan(rf_val) else self._t('na_value')
            lines.append(f"{self._t('rf_title')[:-1]}: {rf_val_str}")
            lines.append("\n" + "=" * 50)
            lines.append(f"Input Data ({len(self.data_points)} points):")
            lines.append("-" * 50)
            lines.extend([f"{i+1}. {p:.4f}" if math.isfinite(p) else f"{i+1}. N/A" for i, p in enumerate(self.data_points)])
            lines.append("=" * 50)
            output = "\n".join(lines)
            fp = filedialog.asksaveasfilename(defaultextension=".txt", filetypes=[("Text files", "*.txt"), ("All files", "*.*")], title=self._t('save_results_title'), initialfile="RiskAnalysisResults.txt")
            if fp:
                with open(fp, 'w', encoding='utf-8') as f: f.write(output)
                self.update_status('status_save_success', filename=os.path.basename(fp))
            else: self.update_status('status_save_cancel')
        except tk.TclError: pass
        except Exception as e: messagebox.showerror(self._t('error_title'), self._t('file_save_error_msg', error=e)); self.update_status('status_save_error')
    def import_data_from_file(self):
        if self._is_closing: return
        fp = filedialog.askopenfilename(title=self._t('file_select_title'), filetypes=[("Excel files", "*.xlsx *.xls"), ("CSV files", "*.csv"), ("All files", "*.*")])
        if not fp: self.update_status('status_import_cancel'); return
        self.update_status('status_importing', filename=os.path.basename(fp))
        new_data_raw = []
        try:
            df = None
            if fp.lower().endswith(('.xlsx', '.xls')): df = pd.read_excel(fp, header=None)
            elif fp.lower().endswith('.csv'):
                try: df = pd.read_csv(fp, header=None, sep=None, engine='python', skip_blank_lines=True)
                except Exception: df = pd.read_csv(fp, header=None, skip_blank_lines=True)
            else: messagebox.showerror(self._t('error_title'), self._t('invalid_format_msg')); self.update_status('status_import_format_error'); return
            if df is None or df.empty: messagebox.showerror(self._t('error_title'), self._t('status_import_no_valid')); self.update_status('status_import_no_valid'); return
            numeric_col_data = None
            for col in df.columns:
                numeric_series = pd.to_numeric(df[col], errors='coerce')
                valid_numeric = numeric_series.dropna()
                if not valid_numeric.empty: numeric_col_data = valid_numeric.tolist(); break
            if numeric_col_data is None: messagebox.showerror(self._t('error_title'), self._t('status_import_no_numeric')); self.update_status('status_import_no_numeric'); return
            new_data_raw = numeric_col_data
            new_data_finite = [x for x in new_data_raw if math.isfinite(x)]
            ignored_count = len(new_data_raw) - len(new_data_finite)
            if not new_data_finite: messagebox.showerror(self._t('error_title'), self._t('status_import_no_valid')); self.update_status('status_import_no_valid'); return
            self.data_points = new_data_finite; self.calculated_results = {}
            self.update_data_display(); self.update_edit_options(); self.reset_results()
            self.selected_edit_index.set(-1); self._update_edit_controls_state(); self._update_action_buttons_state()
            self.update_status('status_import_success', count=len(new_data_finite))
            if ignored_count > 0: messagebox.showwarning(self._t('warning_title'), f"{ignored_count} non-finite values were ignored.")
        except FileNotFoundError: messagebox.showerror(self._t('error_title'), self._t('file_not_found_msg', path=fp)); self.update_status('status_import_error')
        except Exception as e: messagebox.showerror(self._t('error_title'), self._t('file_read_error_msg', error=e)); self.update_status('status_import_error')
    def export_data_to_excel(self):
        if self._is_closing: return
        if not self.data_points: messagebox.showwarning(self._t('warning_title'), self._t('status_no_data_save')); return
        self.update_status('status_saving_data')
        try:
            fp = filedialog.asksaveasfilename(defaultextension=".xlsx", filetypes=[("Excel files", "*.xlsx"), ("All files", "*.*")], title=self._t('save_data_title'), initialfile="ReturnData.xlsx")
            if fp:
                df_to_save = pd.DataFrame({self._t('col_index'): list(range(1, len(self.data_points) + 1)), self._t('col_return'): self.data_points})
                df_to_save.to_excel(fp, index=False, float_format="%.4f")
                self.update_status('status_data_save_success', filename=os.path.basename(fp))
            else: self.update_status('status_save_cancel')
        except Exception as e: messagebox.showerror(self._t('error_title'), self._t('file_save_error_msg', error=e)); self.update_status('status_save_error')

    # --- Closing Functions (on_closing, destroy_app_now) ---
    # (بدون تغییر نسبت به نسخه قبل)
    def on_closing(self, event=None):
        if self._is_closing: return
        print("Closing application requested..."); self._is_closing = True; self.hide_tooltip()
        active_windows_ids = list(self._active_plot_windows.keys())
        print(f"Closing {len(active_windows_ids)} plot window(s)...")
        for window_id in active_windows_ids:
             if window_id in self._active_plot_windows:
                  window = self._active_plot_windows[window_id]
                  try:
                       if window and window.winfo_exists(): window.destroy()
                  except tk.TclError: pass
                  except Exception as e: print(f"Error closing plot window {window_id}: {e}")
             if window_id in self._active_plot_windows: del self._active_plot_windows[window_id]
        try: plt.close('all'); print("Closed Matplotlib figures.")
        except Exception as e: print(f"Error closing Matplotlib figures: {e}")
        print("Destroying main window..."); self.after(10, self.destroy_app_now)
    def destroy_app_now(self):
        try: super().destroy(); print("Application closed.")
        except tk.TclError as e: print(f"TclError during final destroy (might be harmless): {e}")
        except Exception as e: print(f"Error during final destroy: {e}")


if __name__ == "__main__":
    # --- مهم: تنظیم استایل پایه Matplotlib برای تم تیره قبل از ایجاد App ---
    try:
        plt.style.use('dark_background') # شروع با استایل پایه تیره
        plt.rcParams.update({
            "figure.facecolor": DARK_BACKGROUND_COLOR,
            "axes.facecolor": DARK_AXES_COLOR,
            "text.color": DARK_TEXT_COLOR,
            "axes.labelcolor": DARK_TEXT_COLOR,
            "xtick.color": DARK_TEXT_COLOR,
            "ytick.color": DARK_TEXT_COLOR,
            "axes.edgecolor": DARK_GRID_COLOR,
            "axes.titlecolor": DARK_TEXT_COLOR,
            "grid.color": DARK_GRID_COLOR,
            "grid.linestyle": ":",
            "grid.linewidth": 0.6,
            "legend.facecolor": DARK_AXES_COLOR,
            "legend.edgecolor": DARK_GRID_COLOR,
            "legend.labelcolor": DARK_TEXT_COLOR, # اطمینان از رنگ متن لجند
        })
        print("Successfully applied base dark theme settings for Matplotlib.")
    except Exception as e:
        print(f"Could not apply Matplotlib base dark style: {e}")

    # Add bundled font for PyInstaller
    font_added = False
    if getattr(sys, 'frozen', False) and hasattr(sys, '_MEIPASS'):
        print("Running as bundled app.")
        try:
            primary_font_file = 'Vazirmatn-Regular.ttf'
            fallback_font_file = 'Vazir.ttf'
            font_path = resource_path(primary_font_file)
            if not os.path.exists(font_path): font_path = resource_path(fallback_font_file)
            if os.path.exists(font_path):
                 plt.font_manager.fontManager.addfont(font_path)
                 print(f"Attempted to add bundled font to Matplotlib: {font_path}")
                 font_added = True
            else: print(f"Bundled font file '{primary_font_file}' or '{fallback_font_file}' not found.")
        except Exception as e: print(f"Error adding bundled font to Matplotlib: {e}")

    app = AdvancedAnalyticsApp()
    app.mainloop()