// Global variables and constants
let currentLang = 'fa';
let dataPoints = []; // Array to hold numerical data points for the asset
let marketDataPoints = []; // Array to hold market return data points
let benchmarkDataPoints = []; // Array to hold benchmark return data points
let calculatedResults = {};
let selectedEditIndex = -1;

// --- Translations Dictionary ---
const texts = {
    'app_title': {'en': "Advanced Risk & Return Analyzer", 'fa': "تحلیلگر پیشرفته ریسک و بازده"},
    'status_ready': {'en': "Ready.", 'fa': "آماده"},
    'status_calculating': {'en': "Calculating metrics...", 'fa': "در حال محاسبه معیارها..."},
    'status_calc_done': {'en': "Calculations complete.", 'fa': "محاسبات کامل شد."},
    'status_calc_error': {'en': "Calculation error: {error}", 'fa': "خطا در محاسبات: {error}"},
    'status_plotting_hist': {'en': "Plotting histogram...", 'fa': "در حال رسم هیستوگرام..."},
    'status_plotting_box': {'en': "Plotting box plot...", 'fa': "در حال رسم نمودار جعبه‌ای..."},
    'status_plotting_equity': {'en': "Plotting equity curve...", 'fa': "در حال رسم نمودار ارزش تجمعی..."},
    'status_plotting_qq': {'en': "Plotting QQ plot...", 'fa': "در حال رسم نمودار QQ..."},
    'status_plot_done': {'en': "Plot generated.", 'fa': "نمودار رسم شد."},
    'status_plot_error': {'en': "Error plotting: {error}", 'fa': "خطا در رسم نمودار: {error}"},
    'status_data_added': {'en': "{count} data point(s) added for {dataType}.", 'fa': "{count} داده {dataType} با موفقیت اضافه شد."},
    'status_data_invalid': {'en': "{count} added for {dataType}. Some invalid entries ignored: {entries}", 'fa': "{count} داده {dataType} اضافه شد. ورودی‌های نامعتبر ({entries}) نادیده گرفته شدند."},
    'status_no_valid_data': {'en': "Error: No valid data entered for {dataType}.", 'fa': "خطا: هیچ داده معتبری برای {dataType} وارد نشده است."},
    'status_empty_input': {'en': "Empty input ignored for {dataType}.", 'fa': "ورودی خالی برای {dataType} نادیده گرفته شد."},
    'status_data_edited': {'en': "Asset data point {index} edited from {old_val}% to {new_val}%."},
    'status_data_deleted': {'en': "Asset data point {index} ({val}%) deleted."},
    'status_list_cleared': {'en': "{listName} list cleared.", 'fa': "لیست {listName} پاک شد."},
    'status_results_reset': {'en': "Results reset. Click 'Calculate' to analyze.", 'fa': "نتایج پاک شدند. برای تحلیل مجدد، 'محاسبه معیارها' را بزنید."},
    'status_saving_results': {'en': "Preparing to save results...", 'fa': "در حال آماده‌سازی برای ذخیره نتایج..."},
    'status_save_success': {'en': "Results saved to '{filename}'."},
    'status_save_cancel': {'en': "Save operation cancelled.", 'fa': "عملیات ذخیره‌سازی لغو شد."},
    'status_save_error': {'en': "Error saving file.", 'fa': "خطا در ذخیره‌سازی فایل."},
    'status_import_cancel': {'en': "Import operation cancelled or no file dropped.", 'fa': "عملیات ورود داده لغو شد یا فایلی انتخاب نگردید."},
    'status_importing': {'en': "Reading file '{filename}' for {dataType}...", 'fa': "در حال خواندن فایل '{filename}' برای {dataType}..."},
    'status_import_success': {'en': "{count} data points imported successfully for {dataType}.", 'fa': "{count} داده با موفقیت از فایل برای {dataType} وارد شد."},
    'status_import_error': {'en': "Error reading file for {dataType}.", 'fa': "خطا در خواندن فایل برای {dataType}."},
    'status_import_format_error': {'en': "Error: Invalid file format. Please drop a CSV, Excel, or TXT file.", 'fa': "خطا: فرمت فایل نامعتبر است. لطفاً یک فایل CSV، Excel یا TXT انتخاب کنید."},
    'status_import_no_numeric': {'en': "Error: No numeric column found in the file for {dataType}.", 'fa': "خطا: ستون عددی در فایل برای {dataType} یافت نشد."},
    'status_import_no_valid': {'en': "Error: No valid numeric data found in the file/column for {dataType}.", 'fa': "خطا: داده عددی معتبری در فایل/ستون برای {dataType} یافت نشد."},
    'status_rf_error': {'en': "Error: Invalid Risk-Free Rate.", 'fa': "خطا: نرخ بازده بدون ریسک نامعتبر است."},
    'status_expected_market_return_error': {'en': "Error: Invalid Expected Market Return.", 'fa': "خطا: بازده مورد انتظار بازار نامعتبر است."},
    'status_need_data_calc': {'en': "Insufficient asset data for calculation (min 2 points).", 'fa': "داده دارایی کافی برای محاسبات موجود نیست (حداقل ۲ داده)."},
    'status_need_data_plot': {'en': "No data to plot.", 'fa': "داده‌ای برای رسم نمودار وجود ندارد."},
    'status_no_results': {'en': "No results to save.", 'fa': "نتیجه‌ای برای ذخیره موجود نیست."},
    'status_no_data_save': {'en': "No data to save.", 'fa': "داده‌ای برای ذخیره موجود نیست."},
    'status_select_edit': {'en': "Select an asset data item to edit first.", 'fa': "ابتدا یک داده دارایی را برای ویرایش انتخاب کنید."},
    'status_select_delete': {'en': "Select an asset data item to delete first.", 'fa': "ابتدا یک داده دارایی را برای حذف انتخاب کنید."},
    'status_edit_empty': {'en': "New value cannot be empty.", 'fa': "مقدار جدید نمی‌تواند خالی باشد."},
    'status_edit_invalid': {'en': "Invalid value entered.", 'fa': "مقدار وارد شده نامعتبر است."},
    'status_edit_index_error': {'en': "Error saving data (index error).", 'fa': "خطا در ذخیره داده (خطای اندیس)."},
    'status_delete_index_error': {'en': "Error deleting data (index error).", 'fa': "خطا در حذف داده (خطای اندیس)."},
    'status_plot_error_no_paired_data': {'en': "Regression plot error: Asset and market data must have the same number of points.", 'fa': "خطای نمودار رگرسیون: تعداد داده‌های دارایی و بازار باید یکسان باشد.", 'title': "Regression Data Mismatch"},
    'status_plot_error_no_regression_params': {'en': "Regression plot error: Beta and Alpha parameters not available or invalid.", 'fa': "خطای نمودار رگرسیون: پارامترهای بتا و آلفا موجود یا معتبر نیستند.", 'title': "Regression Parameters Missing"},
    'status_feature_unavailable': {'en': "This feature ({feature}) is currently unavailable.", 'fa': "این قابلیت ({feature}) در حال حاضر در دسترس نیست."},
    'value_invalid': {'en': "N/A", 'fa': "ناموجود"}, // Changed from "نامعتبر" to "ناموجود" for better context in results

    'results_title': {'en': "Analysis Results:", 'fa': "نتایج تحلیل"},
    'data_count': {'en': "Data Points", 'fa': "تعداد داده‌ها"},
    'mean_label': {'en': "Arithmetic Mean", 'fa': "میانگین حسابی"},
    'geo_mean_label': {'en': "Geometric Mean (CAGR)", 'fa': "میانگین هندسی (CAGR)"},
    'std_dev_label': {'en': "Standard Deviation (Risk)", 'fa': "انحراف معیار (ریسک)"},
    'downside_dev_label': {'en': "Downside Deviation (Target=0)", 'fa': "انحراف معیار نزولی (هدف=۰)"},
    'variance_label': {'en': "Variance", 'fa': "واریانس"},
    'cv_label': {'en': "Coefficient of Variation (CV)", 'fa': "ضریب تغییرات (CV)"},
    'mdd_label': {'en': "Max Drawdown (MDD)", 'fa': "حداکثر افت سرمایه (MDD)"},
    'mdd_period_label': {'en': "MDD Period (steps)", 'fa': "دوره MDD (تعداد دوره)"},
    'skewness_label': {'en': "Skewness", 'fa': "چولگی"},
    'kurtosis_label': {'en': "Excess Kurtosis", 'fa': "کشیدگی مازاد"},
    'normality_label': {'en': "Normality (Shapiro-Wilk)", 'fa': "نرمال بودن (شاپیرو-ویلک)"},
    'var_label': {'en': "Historical VaR 5%", 'fa': "ارزش در معرض خطر تاریخی ۵٪"},
    'var_95_label': {'en': "Historical Gain 95%", 'fa': "کسب سود تاریخی ۹۵٪"},
    'max_gain_label': {'en': "Max Gain", 'fa': "حداکثر سود"},
    'sharpe_label': {'en': "Sharpe Ratio", 'fa': "نسبت شارپ"},
    'sortino_label': {'en': "Sortino Ratio", 'fa': "نسبت سورتینو"},
    'cvar_label': { 'fa': "CVaR ۵٪ (کسری مورد انتظار)", 'en': "CVaR 5% (Expected Shortfall)"},
    'omega_label': { 'fa': "نسبت اُمگا (آستانه: RF)", 'en': "Omega Ratio (Threshold: RF)"},

    'add_data_title': {'en': "Asset Return Data (%)", 'fa': "داده بازده دارایی (%)"}, // Updated title
    'add_data_hint': {'en': "(Enter multiple values separated by comma, space, or newline)", 'fa': "(مقادیر متعدد را با کاما، فاصله یا خط جدید وارد کنید)"},
    'add_data_placeholder': {'en': "Enter asset return value(s)...", 'fa': "مقادیر بازده دارایی..."},
    'add_button': {'en': "Add", 'fa': "افزودن"},
    'edit_delete_title': {'en': "Edit / Delete Asset Data:", 'fa': "ویرایش / حذف داده دارایی"},
    'edit_placeholder': {'en': "New value", 'fa': "مقدار جدید"},
    'save_button': {'en': "Save", 'fa': "ذخیره"},
    'delete_button': {'en': "Delete", 'fa': "حذف"},
    'rf_title': {'en': "Risk-Free Rate (% Annually):", 'fa': "نرخ بازده بدون ریسک (% سالانه)"},
    'rf_placeholder': {'en': "e.g., 2.5", 'fa': "مثال: 2.5"},
    'data_list_title': {'en': "Current Asset Data List:", 'fa': "لیست داده‌های دارایی فعلی"},
    'clear_list_button': {'en': "Clear Asset List", 'fa': "پاک کردن لیست دارایی"},
    'calculate_button': {'en': "Calculate Metrics", 'fa': "محاسبه معیارها"},
    'plot_hist_button': {'en': "Plot Histogram", 'fa': "رسم هیستوگرام"},
    'plot_box_button': {'en': "Plot Box Plot", 'fa': "رسم نمودار جعبه‌ای"},
    'plot_equity_button': {'en': "Plot Equity Curve", 'fa': "رسم نمودار ارزش تجمعی"},
    'plot_qq_button': {'en': "Plot QQ-Plot", 'fa': "رسم نمودار QQ"},
    'lang_select_label': {'en': "Language:", 'fa': "زبان"},
    'list_empty_option': {'en': "List Empty", 'fa': "لیست خالی است."},
    'select_option': {'en': "Select...", 'fa': "انتخاب کنید..."},
    'data_option_format': {'en': "Data {index} ({value}%)", 'fa': "داده {index} ({value}٪)"},
    'save_results_button_unified': {'en': "Save Results", 'fa': "ذخیره نتایج"},
    'drop_zone_prompt_dedicated_asset': {'en': "Drag & drop your Asset CSV/Excel/TXT file here", 'fa': "فایل CSV/Excel/TXT بازده دارایی را اینجا بکشید"},
    'or_divider_text': {'en': "OR", 'fa': "یا"},
    'plot_modal_title': {'en': "Chart", 'fa': "نمودار"},

    // Tooltips
    'mean_tooltip': { 'fa': "میانگین حسابی: میانگین ساده بازده‌ها.", 'en': "Arithmetic Mean: Simple average of returns."},
    'geo_mean_tooltip': { 'fa': "میانگین هندسی (CAGR): نرخ بازده متوسط ترکیبی. مناسب برای عملکرد بلندمدت.", 'en': "Geometric Mean (CAGR): Compound average rate of return. More accurate for long-term performance."},
    'std_dev_tooltip': { 'fa': "انحراف معیار: پراکندگی بازده‌ها حول میانگین (ریسک کل). مقدار بالاتر = نوسان و ریسک بیشتر.", 'en': "Standard Deviation: Dispersion of returns around the mean (Total Risk). Higher value = more volatility/risk."},
    'downside_dev_tooltip': { 'fa': "انحراف معیار نزولی (هدف=۰): پراکندگی بازده‌های زیر صفر. معیاری از ریسک نامطلوب (ریسک زیان).", 'en': "Downside Deviation (Target=0): Dispersion of returns below zero. Measures unfavorable volatility (Loss Risk)."},
    'variance_tooltip': { 'fa': "واریانس: میانگین مجذور انحرافات از میانگین. واحد اصلی پراکندگی.", 'en': "Variance: Average squared deviation from the mean. Primary unit of dispersion."},
    'cv_tooltip': { 'fa': "ضریب تغییرات (CV): ریسک به ازای واحد بازده. برای مقایسه ریسک دارایی‌ها با بازده متفاوت. پایین‌تر بهتر است.", 'en': "Coefficient of Variation (CV): Risk per unit of return (StdDev / Mean). Useful for comparing risk of assets with different returns. Lower is better."},
    'mdd_tooltip': { 'fa': "حداکثر افت سرمایه: بزرگترین افت درصدی از قله قبلی در بازده تجمعی. ریسک افت شدید را می‌سنجد.", 'en': "Maximum Drawdown: Largest peak-to-trough percentage decline in cumulative returns. Measures downside risk."},
    'mdd_period_tooltip': { 'fa': "دوره MDD: طول دوره (تعداد نقاط داده) حداکثر افت سرمایه، از قله تا بازیابی (یا انتها).", 'en': "MDD Period: Duration (in number of data points/periods) of the maximum drawdown, from peak to recovery (or end)."},
    'skewness_tooltip': { 'fa': "چولگی: عدم تقارن توزیع. منفی: دم بلندتر چپ (زیان‌های بزرگ محتمل‌تر). مثبت: دم بلندتر راست (سودهای بزرگ محتمل‌تر). صفر: متقارن.", 'en': "Skewness: Asymmetry of the distribution. Negative: Longer left tail (large losses more likely). Positive: Longer right tail (large gains more likely). Zero: Symmetric."},
    'kurtosis_tooltip': { 'fa': "کشیدگی اضافی: چاقی دم‌های توزیع نسبت به نرمال. مثبت: دم‌های چاق‌تر، احتمال مقادیر حدی بیشتر (ریسک دم).", 'en': "Excess Kurtosis: Fatness of the distribution's tails relative to Normal (Kurtosis - 3). Positive: Fatter tails, higher probability of extreme values (Tail Risk)."},
    'normality_tooltip': { 'fa': "آزمون نرمال بودن شاپیرو-ویلک: آزمون می‌کند آیا داده‌ها به طور معناداری از توزیع نرمال انحراف دارند یا خیر. (در این نسخه محاسبه نمی‌شود)", 'en': "Shapiro-Wilk Normality Test: Tests if data significantly deviates from a normal distribution. (Not calculated in this version)"},
    'var_tooltip': { 'fa': "ارزش در معرض خطر (VaR) ۵٪ تاریخی: حداکثر زیانی که انتظار می‌رود در ۹۵٪ مواقع از آن کمتر باشد.", 'en': "Historical Value at Risk (VaR) 5%: Maximum loss expected to be exceeded only 5% of the time."},
    'var_95_tooltip': { 'fa': "سود تاریخی ۹۵٪: حداقل سودی که در ۵٪ بهترین دوره‌ها بدست آمده.", 'en': "Historical Gain 95%: Minimum gain achieved in the best 5% of periods."},
    'max_gain_tooltip': { 'fa': "حداکثر سود: بیشترین بازده مشاهده شده در یک دوره در داده‌ها.", 'en': "Maximum Gain: The highest single period return observed in the data."},
    'sharpe_tooltip': { 'fa': "نسبت شارپ: بازده مازاد بر نرخ بدون ریسک به ازای هر واحد ریسک کل. بالاتر = عملکرد تعدیل‌شده بر اساس ریسک بهتر.", 'en': "Sharpe Ratio: Excess return over risk-free rate per unit of total risk. Higher is better risk-adjusted performance."},
    'sortino_tooltip': { 'fa': "نسبت سورتینو: بازده مازاد بر نرخ بدون ریسک به ازای هر واحد ریسک نزولی. ریسک بد را مجازات می‌کند. بالاتر بهتر است.", 'en': "Sortino Ratio: Excess return over risk-free rate per unit of downside risk. Penalizes only bad risk. Higher is better."},
    'rf_tooltip': { 'fa': "نرخ بازده بدون ریسک: نرخ بازده مورد انتظار از سرمایه‌گذاری بدون ریسک (مانند اوراق خزانه). برای محاسبه بازده مازاد. به صورت درصد سالانه وارد کنید.", 'en': "Risk-Free Rate: Expected return on a zero-risk investment (e.g., government bonds). Used to calculate excess return. Enter as annual percentage."},
    'cvar_tooltip': { 'fa': "ارزش در معرض خطر شرطی (CVaR) / کسری مورد انتظار (ES) ۵٪: میانگین زیان‌هایی است که در ۵٪ بدترین سناریوهای تاریخی بازده رخ می‌دهد.", 'en': "Conditional Value at Risk (CVaR) / Expected Shortfall (ES) 5%: Average loss in the worst 5% of historical return scenarios."},
    'omega_tooltip': { 'fa': "نسبت اُمگا: نسبت مجموع وزنی بازده‌های مطلوب (بالاتر از آستانه) به مجموع وزنی بازده‌های نامطلوب (پایین‌تر از آستانه).", 'en': "Omega Ratio: Ratio of weighted desirable returns (above threshold) to weighted undesirable returns (below threshold)."},

    // SweetAlert titles and buttons
    'error_title': {'en': "Error", 'fa': "خطا"},
    'warning_title': {'en': "Warning", 'fa': "هشدار"},
    'info_title': {'en': "Information", 'fa': "اطلاعات"},
    'ok_button': {'en': "OK", 'fa': "باشه"},
    'cancel_button': {'en': "Cancel", 'fa': "لغو"},
    'deleted_title': {'en': "Deleted!", 'fa': "حذف شد!"},
    'cleared_title': {'en': "Cleared!", 'fa': "پاک شد!"},
    'clear_list_confirm': {'en': "Clear entire {listName} list?", 'fa': "کل لیست {listName} پاک شود؟"},
    'confirm_clear_text': {'en': "This action cannot be undone.", 'fa': "این عملیات قابل بازگشت نیست."},
    'confirm_delete_text': {'en': "Are you sure you want to delete this data point?", 'fa': "آیا از حذف این داده مطمئن هستید؟"},
    'invalid_format_msg': {'en': "Invalid file format. Please use CSV, Excel, or TXT.", 'fa': "فرمت فایل نامعتبر است. لطفاً از فایل‌های CSV، Excel یا TXT استفاده کنید."},
    'file_save_error_msg': {'en': "Could not save the file: {error}", 'fa': "فایل ذخیره نشد: {error}"},

    // Export related
    'export_format_title': {'en': "Select Export Format", 'fa': "فرمت خروجی را انتخاب کنید"},
    'export_txt': {'en': "Text File (.txt)", 'fa': "فایل متنی (.txt)"},
    'export_excel': {'en': "Excel File (.xlsx)", 'fa': "فایل اکسل (.xlsx)"},
    'excel_sheet_raw_data_title': {'en': "Raw Data", 'fa': "داده‌های خام"},
    'excel_sheet_results_title': {'en': "Analysis Results", 'fa': "نتایج تحلیل"},
    'status_saving_txt_success': {'en': "Results saved to '{filename}'.", 'fa': "نتایج با موفقیت در فایل '{filename}' ذخیره شد."},
    'status_saving_excel_success': {'en': "Results saved to '{filename}'.", 'fa': "نتایج با موفقیت در فایل '{filename}' ذخیره شد."},
    'col_return': {'en': "Return (%)", 'fa': "بازده (٪)"},
    'Date': {'en': "Date", 'fa': "تاریخ"},

    // Plotting specific
    'plot_failed': {'en': "Plot generation failed.", 'fa': "ایجاد نمودار با شکست مواجه شد."},
    'noDataPlot': {'en': "No data available to plot.", 'fa': "داده‌ای برای رسم نمودار موجود نیست."},
    'error_lib_missing': {'en': "Required library ({lib}) is missing for this plot.", 'fa': "کتابخانه مورد نیاز ({lib}) برای این نمودار یافت نشد."},
    'status_qq_insufficient_points': {'en': "Not enough valid data points to generate QQ-Plot.", 'fa': "نقاط داده معتبر کافی برای ایجاد نمودار Q-Q وجود ندارد."},
    'hist_label_main': {'en': "Return Data", 'fa': "داده‌های بازده"},
    'plot_norm_label': {'en': "Normal Fit (μ={mean}%, σ={std}%)", 'fa': "برازش نرمال (μ={mean}٪، σ={std}٪)"},
    'plot_kde_label': {'en': "Kernel Density Estimate (KDE)", 'fa': "تخمین چگالی کرنل (KDE)"},
    'plot_mean_val_label': {'en': "Mean: {val}%", 'fa': "میانگین: {val}٪"},
    'plot_median_val_label': {'en': "Median: {val}%", 'fa': "میانه: {val}٪"},
    'median_label': {'en': "Median", 'fa': "میانه"},
    'plot_var_label': {'en': "Hist. VaR 5%: {val}%", 'fa': "ارزش در معرض خطر تاریخی ۵٪: {val}٪"},
    'plot_gain_label': {'en': "Hist. Gain 95%: {val}%", 'fa': "کسب سود تاریخی ۹۵٪: {val}٪"},
    'plot_ylabel_hist_density': {'en': "Density", 'fa': "چگالی"},
    'plot_xlabel': {'en': "Return (%) / Value", 'fa': "بازده (٪) / مقدار"},
    'hist_hover_value': {'en': "Value", 'fa': "مقدار"},
    'plot_ylabel_hist': {'en': "Frequency / Density", 'fa': "فراوانی / چگالی"},
    'boxplot_hover_stats': {'en': "Statistics", 'fa': "آمارها"},
    'boxplot_hover_max': {'en': "Max (Upper Fence)", 'fa': "حداکثر (حصار بالا)"},
    'boxplot_hover_q3': {'en': "Q3 (75th Pctl)", 'fa': "چارک سوم (صدک ۷۵)"},
    'boxplot_hover_median': {'en': "Median", 'fa': "میانه"},
    'boxplot_hover_q1': {'en': "Q1 (25th Pctl)", 'fa': "چارک اول (صدک ۲۵)"},
    'boxplot_hover_min': {'en': "Min (Lower Fence)", 'fa': "حداقل (حصار پایین)"},
    'boxplot_hover_mean': {'en': "Mean", 'fa': "میانگین"},
    'boxplot_hover_std': {'en': "Std. Dev.", 'fa': "انحراف معیار"},
    'plot_ylabel_box': {'en': "Return (%) Values", 'fa': "مقادیر بازده (٪)"},
    'plot_box_title': {'en': "Box Plot of Returns", 'fa': "نمودار جعبه‌ای بازده‌ها"},
    'equity_curve_label': {'en': "Equity Curve", 'fa': "منحنی ارزش تجمعی"},
    'period_label': {'en': "Period", 'fa': "دوره"},
    'equity_value_label': {'en': "Equity Value", 'fa': "ارزش تجمعی"},
    'hwm_label': {'en': "High Water Mark", 'fa': "بیشترین ارزش ثبت شده"},
    'drawdown_from_hwm_label': {'en': "Drawdown from HWM", 'fa': "افت از بیشترین ارزش"},
    'hwm_trace_label': {'en': "High Water Mark Line", 'fa': "خط بیشترین ارزش (HWM)"},
    'plot_equity_title': {'en': "Cumulative Equity Curve", 'fa': "نمودار ارزش تجمعی سرمایه"},
    'plot_xlabel_equity': {'en': "Time Period / Observation", 'fa': "دوره زمانی / مشاهده"},
    'plot_ylabel_equity_value': {'en': "Cumulative Value (Initial = 100)", 'fa': "ارزش تجمعی (اولیه = ۱۰۰)"},
    'qq_data_quantiles_label': {'en': "Data Quantiles", 'fa': "چارک‌های داده"},
    'qq_hover_point': {'en': "Quantile Point", 'fa': "نقطه چارک"},
    'qq_hover_theoretical': {'en': "Theoretical Quantile (Normal)", 'fa': "چارک نظری (نرمال)"},
    'qq_hover_sample': {'en': "Sample Quantile (Data)", 'fa': "چارک نمونه (داده)"},
    'qq_norm_ref_line_label': {'en': "Normal Reference Line", 'fa': "خط مرجع نرمال"},
    'plot_qq_title': {'en': "Q-Q Plot (vs. Normal Distribution)", 'fa': "نمودار Q-Q (در برابر توزیع نرمال)"},
    'plot_qq_xlabel': {'en': "Theoretical Quantiles (Standard Normal)", 'fa': "چارک‌های نظری (نرمال استاندارد)"},
    'plot_qq_ylabel': {'en': "Sample Quantiles (Return Data %)", 'fa': "چارک‌های نمونه (داده بازده ٪)"},

    // Regression Analysis Specific
    'regression_results_title': {'en': "Regression Analysis (CAPM)", 'fa': "تحلیل رگرسیون (CAPM)"},
    'beta_label': {'en': "Beta (β)", 'fa': "بتا (β)"},
    'alpha_label': {'en': "Alpha (α)", 'fa': "آلفا (α)"},
    'rsquared_label': {'en': "R-squared (R²)", 'fa': "ضریب تعیین (R²)"},
    'reg_stderr_label': {'en': "Std. Error of Regression", 'fa': "خطای استاندارد رگرسیون"},
    'beta_t_stat_label': {'en': "Beta t-statistic", 'fa': "آماره t بتا"},
    'beta_p_value_label': {'en': "Beta p-value", 'fa': "مقدار p بتا"},
    'alpha_t_stat_label': {'en': "Alpha t-statistic", 'fa': "آماره t آلفا"},
    'alpha_p_value_label': {'en': "Alpha p-value", 'fa': "مقدار p آلفا"},
    'capm_expected_return_label': {'en': "CAPM Expected Return", 'fa': "بازده مورد انتظار CAPM"},

    'add_market_data_title': {'en': "Market Return Data (%) (for CAPM)", 'fa': "داده بازده بازار (%) (برای CAPM)"},
    'add_market_data_hint_short': {'en': "Count must match asset data.", 'fa': "تعداد باید با داده دارایی یکسان باشد."},
    'add_market_data_placeholder': {'en': "Enter market return values...", 'fa': "مقادیر بازده بازار..."},
    'add_market_data_button': {'en': "Add Market Data", 'fa': "افزودن داده بازار"},
    'clear_market_data_button': {'en': "Clear Market Data", 'fa': "پاک کردن داده‌های بازار"},
    'market_list_empty_option': {'en': "Market data list is empty.", 'fa': "لیست داده‌های بازار خالی است."},
    'plot_regression_button': {'en': "Regression Plot", 'fa': "نمودار رگرسیون"},

    // Benchmark Analysis Specific
    'benchmark_analysis_title': {'en': "Benchmark Analysis", 'fa': "تحلیل معیار"},
    'add_benchmark_data_title': {'en': "Benchmark Return Data (%) (for Benchmark Analysis)", 'fa': "داده بازده معیار (%) (برای تحلیل معیار)"},
    'add_benchmark_data_hint_short': {'en': "Count must match asset data.", 'fa': "تعداد باید با داده دارایی یکسان باشد."},
    'add_benchmark_data_placeholder': {'en': "Enter benchmark return values...", 'fa': "مقادیر بازده معیار..."},
    'add_benchmark_data_button': {'en': "Add Benchmark Data", 'fa': "افزودن داده معیار"},
    'clear_benchmark_data_button': {'en': "Clear Benchmark Data", 'fa': "پاک کردن داده‌های معیار"},
    'benchmark_list_empty_option': {'en': "Benchmark data list is empty.", 'fa': "لیست داده‌های معیار خالی است."},
    'tracking_error_label': {'en': "Tracking Error", 'fa': "خطای پیگیری"},
    'information_ratio_label': {'en': "Information Ratio", 'fa': "نسبت اطلاعات"},

    // Expected Market Return
    'expected_market_return_title': {'en': "Expected Market Return (% Annually):", 'fa': "بازده مورد انتظار بازار (% سالانه):"},
    'expected_market_return_placeholder': {'en': "e.g., 8.0", 'fa': "مثال: 8.0"},
    'expected_market_return_tooltip': {'en': "Expected return of the overall market, used for CAPM calculation.", 'fa': "بازده مورد انتظار کل بازار، برای محاسبه CAPM استفاده می‌شود."},


    // Tooltips for new metrics
    'tracking_error_tooltip': { 'fa': "انحراف معیار تفاوت بازده سبد و بازده معیار. میزان پایداری عملکرد مازاد را می‌سنجد.", 'en': "Standard deviation of the difference between portfolio and benchmark returns. Measures consistency of outperformance."},
    'information_ratio_tooltip': { 'fa': "بازده فعال (مازاد بر معیار) تقسیم بر خطای پیگیری. بازده فعال تعدیل شده بر اساس ریسک را می‌سنجد.", 'en': "Active return (excess over benchmark) divided by tracking error. Measures risk-adjusted active return."},
    'capm_expected_return_tooltip': { 'fa': "بازده مورد انتظار دارایی بر اساس مدل CAPM: ER = Rf + Beta * (Rm - Rf).", 'en': "Expected return of the asset based on CAPM: ER = Rf + Beta * (Rm - Rf)."},
    'beta_tooltip': { 'fa': "بتا معیاری برای سنجش ریسک سیستماتیک یک دارایی نسبت به کل بازار است.", 'en': "Beta measures the systematic risk of an asset relative to the overall market."},
    'alpha_tooltip': { 'fa': "آلفا بازده مازاد یک سرمایه‌گذاری پس از تعدیل برای ریسک سیستماتیک (بتا) است.", 'en': "Alpha is the excess return of an investment after adjusting for systematic risk (beta)."},
    'rsquared_tooltip': { 'fa': "ضریب تعیین (R²) درصدی از تغییرات بازده دارایی است که توسط تغییرات بازده بازار توضیح داده می‌شود.", 'en': "R-squared (R²) is the percentage of an asset's return variability explained by market return variability."},
    'reg_stderr_tooltip': { 'fa': "خطای استاندارد رگرسیون، میزان پراکندگی یا خطای معمول نقاط داده واقعی حول خط رگرسیون را نشان می‌دهد.", 'en': "Standard Error of Regression shows the typical dispersion of actual data points around the fitted regression line."},
    'beta_t_stat_tooltip': { 'fa': "آماره t برای بتا، معناداری آماری ضریب بتا را آزمون می‌کند.", 'en': "Beta t-statistic tests the statistical significance of the beta coefficient."},
    'beta_p_value_tooltip': { 'fa': "مقدار p برای بتا، احتمال مشاهده آماره t محاسبه شده (یا شدیدتر)، اگر بتای واقعی صفر باشد را نشان می‌دهد.", 'en': "Beta p-value is the probability of observing the calculated t-statistic (or more extreme) if the true beta is zero."},
    'alpha_t_stat_tooltip': { 'fa': "آماره t برای آلفا، معناداری آماری ضریب آلفا را آزمون می‌کند.", 'en': "Alpha t-statistic tests the statistical significance of the alpha coefficient."},
    'alpha_p_value_tooltip': { 'fa': "مقدار p برای آلفا، احتمال مشاهده آماره t محاسبه شده برای آلفا (یا شدیدتر)، اگر آلفای واقعی صفر باشد را نشان می‌دهد.", 'en': "Alpha p-value is the probability of observing the calculated t-statistic for alpha (or more extreme) if the true alpha is zero."},

    // Plotting specific (Regression)
    'plot_regression_title': { 'en': 'Regression Plot (Asset vs. Market)', 'fa': 'نمودار رگرسیون (دارایی در مقابل بازار)'},
    'status_plot_error_no_paired_data': { 'en': "Paired asset and market data are required for regression plot.", 'fa': "برای نمودار رگرسیون به داده‌های جفت شده دارایی و بازار نیاز است." },
    'status_plot_error_no_regression_params': { 'en': "Regression parameters (alpha, beta) are not available for plotting.", 'fa': "پارامترهای رگرسیون (آلفا، بتا) برای رسم نمودار در دسترس نیستند." },
    'scatter_plot_legend_actual': { 'en': "Actual Returns", 'fa': "بازده واقعی" },
    'scatter_plot_legend_regression_line': { 'en': "Regression Line (α={alpha}%, β={beta})", 'fa': "خط رگرسیون (α={alpha}٪، β={beta})"}, // Added % to alpha
    'plot_axis_market_returns': { 'en': "Market Returns (%)", 'fa': "بازده بازار (%)" },
    'plot_axis_asset_returns': { 'en': "Asset Returns (%)", 'fa': "بازده دارایی (%)" },
};

// --- DOM Element Selectors ---
// Asset Data
const valueEntry = document.getElementById('value-entry');
const addButton = document.getElementById('add-button');
const editSelect = document.getElementById('edit-select');
const editValueEntry = document.getElementById('edit-value-entry');
const saveEditButton = document.getElementById('save-edit-button');
const deleteButton = document.getElementById('delete-button');
const dataDisplay = document.getElementById('data-display');
const clearListButton = document.getElementById('clear-list-button');
const dedicatedFileDropAreaAsset = document.getElementById('dedicated-file-drop-area'); // Assuming this is for asset
const fileImporterInputAsset = document.getElementById('file-importer-input-asset');

// Market Data
const marketValueEntry = document.getElementById('market-value-entry');
const addMarketDataButton = document.getElementById('add-market-data-button');
const marketDataDisplay = document.getElementById('market-data-display');
const clearMarketDataButton = document.getElementById('clear-market-data-button');

// Benchmark Data
const benchmarkValueEntry = document.getElementById('benchmark-value-entry');
const addBenchmarkDataButton = document.getElementById('add-benchmark-data-button');
const benchmarkDataDisplay = document.getElementById('benchmark-data-display');
const clearBenchmarkDataButton = document.getElementById('clear-benchmark-data-button');

// General & Controls
const langSelect = document.getElementById('lang-select');
const rfRateInput = document.getElementById('rf-rate');
const expectedMarketReturnInput = document.getElementById('expected-market-return');
const calculateButton = document.getElementById('calculate-button');
const plotHistButton = document.getElementById('plot-hist-button');
const plotBoxButton = document.getElementById('plot-box-button');
const plotEquityButton = document.getElementById('plot-equity-button');
const plotQqButton = document.getElementById('plot-qq-button');
const plotRegressionButton = document.getElementById('plot-regression-button');
const exportResultsButton = document.getElementById('export-results-button');
const statusBar = document.getElementById('status-bar');
const resultsDisplayDiv = document.getElementById('results-display');

// Plot Modal
const plotModal = document.getElementById('plotModal');
const plotModalLabel = document.getElementById('plotModalLabel');
const plotContainer = document.getElementById('plot-container');
const plotModalCloseButton = document.getElementById('plotModalCloseButton');


// --- Utility Functions ---
function _t(key, args = {}) {
    const langTexts = texts[key];
    let text = key; // Fallback to key if not found
    if (langTexts) {
        text = langTexts[currentLang] || langTexts['en'] || key;
    }
    if (args && typeof args === 'object') {
        for (const argKey in args) {
            const regex = new RegExp(`\\{${argKey}\\}`, 'g'); // Simpler regex
            text = text.replace(regex, args[argKey]);
        }
    }
    return text;
}

function updateStatus(key, args = {}, type = 'info') {
    const message = _t(key, args);
    if (statusBar) {
        statusBar.textContent = message;
        statusBar.className = 'status-bar p-2 rounded text-sm text-center'; // Reset classes
        switch (type) {
            case 'success': statusBar.classList.add('bg-green-500', 'text-white'); break;
            case 'error': statusBar.classList.add('bg-red-500', 'text-white'); break;
            case 'warning': statusBar.classList.add('bg-yellow-500', 'text-black'); break;
            case 'info': default: statusBar.classList.add('bg-dark-card', 'text-dark-text-muted'); break;
        }
    }
    console.log(`Status (${type}):`, message);
}

function updateLanguageUI() {
    currentLang = langSelect.value;
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'fa' ? 'rtl' : 'ltr';
    document.title = _t('app_title');

    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        el.textContent = _t(key);
    });

    document.querySelectorAll('[data-translate-placeholder]').forEach(el => {
         const key = el.getAttribute('data-translate-placeholder');
         if(key) el.placeholder = _t(key);
    });

    updateEditOptions();
    updateDataDisplay(); // For asset data
    updateMarketDataDisplay();
    updateBenchmarkDataDisplay();

    if (Object.keys(calculatedResults).length > 0) {
        updateResultsUI();
    } else {
        resetResultsDisplay(); // Ensure results are reset if no calculations yet
    }
    updateStatus('status_ready');
}

function formatNumber(value, digits = 2, addPercent = false) {
    if (value === Infinity) return "∞";
    if (value === -Infinity) return "-∞";
    if (typeof value !== 'number' || !isFinite(value) || isNaN(value)) {
        return _t('value_invalid');
    }
    digits = Math.max(0, Math.floor(digits));
    const locale = currentLang === 'fa' ? 'fa-IR' : 'en-US';
    const options = {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    };
    let formatted = new Intl.NumberFormat(locale, options).format(value);
    if (addPercent) {
        formatted = currentLang === 'fa' ? `%${formatted}` : `${formatted}%`;
    }
    return formatted;
}

// --- Data Handling Functions (Generic for Asset, Market, Benchmark) ---
function addDataPointsToList(rawInput, targetList, listNameKey, dataTypeTextKey) {
    if (!rawInput) {
        updateStatus('status_empty_input', { dataType: _t(dataTypeTextKey) }, 'info');
        return 0; // No data added
    }
    const potentialValues = rawInput.split(/[\s,;\\n\t]+/).filter(val => val);
    let addedCount = 0;
    const invalidEntries = [];
    const newlyAddedData = [];

    potentialValues.forEach(rawVal => {
        const cleanedValue = rawVal.replace(/%/g, '').trim();
        if (!cleanedValue) return;
        const valueStr = cleanedValue.replace(',', '.'); // Handle comma as decimal separator
        const value = parseFloat(valueStr);

        if (!isNaN(value) && isFinite(value)) {
            newlyAddedData.push(value);
            addedCount++;
        } else {
            invalidEntries.push(rawVal);
        }
    });

    if (addedCount > 0) {
        targetList.push(...newlyAddedData);
        let statusKey = 'status_data_added';
        let statusArgs = { count: addedCount, dataType: _t(dataTypeTextKey) };
        let statusType = 'success';

        if (invalidEntries.length > 0) {
            statusKey = 'status_data_invalid';
            const entriesStr = `${invalidEntries.slice(0, 3).join(', ')}${invalidEntries.length > 3 ? '...' : ''}`;
            statusArgs['entries'] = entriesStr;
            statusType = 'warning';
            console.warn(_t(statusKey, statusArgs));
        }
        updateStatus(statusKey, statusArgs, statusType);
    } else if (invalidEntries.length > 0) {
        Swal.fire(_t('error_title'), _t('status_no_valid_data', { dataType: _t(dataTypeTextKey) }), 'error');
        updateStatus('status_no_valid_data', { dataType: _t(dataTypeTextKey) }, 'error');
    }
    return addedCount; // Return how many were actually added
}

function updateGenericDataDisplay(list, displayElement, emptyListOptionKey, itemPrefixKey) {
    const placeholder = displayElement ? displayElement.querySelector('.data-placeholder') : null;

    if (displayElement) {
        // Clear previous entries, keeping placeholder if it exists
        while (displayElement.firstChild && displayElement.firstChild !== placeholder) {
            displayElement.removeChild(displayElement.firstChild);
        }
         if (placeholder) placeholder.style.display = 'none';

        if (list.length === 0) {
            if (placeholder) {
                placeholder.textContent = _t(emptyListOptionKey);
                placeholder.style.display = 'block';
                if (!displayElement.contains(placeholder)) {
                    displayElement.appendChild(placeholder);
                }
            } else { // Create placeholder if it doesn't exist
                const p = document.createElement('p');
                p.className = 'text-dark-text-muted text-center p-1 data-placeholder';
                p.textContent = _t(emptyListOptionKey);
                displayElement.appendChild(p);
            }
        } else {
            if (placeholder) placeholder.style.display = 'none';
            const fragment = document.createDocumentFragment();
            list.forEach((p, i) => {
                const item = document.createElement('div');
                item.className = 'py-1 px-2 border-b border-dark-border last:border-b-0 flex justify-between items-center text-xs'; // Smaller text
                item.innerHTML = `<span class="text-dark-text-muted mr-1">${formatNumber(i + 1, 0)}.</span> <span class="font-mono text-dark-text">${formatNumber(p, 4)}%</span>`;
                fragment.appendChild(item);
            });
            displayElement.appendChild(fragment);
        }
    }
}

function clearGenericDataList(list, listNameKey, displayFunction, clearButtonElement) {
    if (list.length === 0) return;
    Swal.fire({
        title: _t('clear_list_confirm', {listName: _t(listNameKey)}),
        text: _t('confirm_clear_text'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: _t('ok_button'),
        cancelButtonText: _t('cancel_button'),
        customClass: { popup: 'swal2-popup', title: 'swal2-title', htmlContainer: 'swal2-html-container', confirmButton: 'swal2-confirm', cancelButton: 'swal2-cancel'}
    }).then((result) => {
        if (result.isConfirmed) {
            list.length = 0; // Clears the array in place
            displayFunction();
            if (clearButtonElement) clearButtonElement.disabled = true;
            updateStatus('status_list_cleared', { listName: _t(listNameKey) }, 'success');
            Swal.fire(_t('cleared_title'), _t('status_list_cleared', { listName: _t(listNameKey) }), 'success');
        }
    });
}

// --- Asset Data Specific ---
function addAssetDataPoint() {
    const rawInput = valueEntry.value.trim();
    const added = addDataPointsToList(rawInput, dataPoints, 'data_list_title', 'add_data_title');
    if (added > 0) {
        updateDataDisplay();
        updateEditOptions();
        resetResultsDisplay();
        updateActionButtonsState();
    }
    valueEntry.value = '';
    valueEntry.focus();
}

function updateDataDisplay() {
    updateGenericDataDisplay(dataPoints, dataDisplay, 'list_empty_option', 'data_option_format');
    if(clearListButton) clearListButton.disabled = dataPoints.length === 0;
    updateActionButtonsState();
}

function updateEditOptions() {
    if (!editSelect) return;
    const currentSelectedIndexStr = editSelect.value;
    editSelect.innerHTML = `<option value="" data-translate="select_option">${_t('select_option')}</option>`;

    if (dataPoints.length === 0) {
        editSelect.options[0].textContent = _t('list_empty_option');
        editSelect.disabled = true;
    } else {
        dataPoints.forEach((p, i) => {
            const option = document.createElement('option');
            option.value = i.toString();
            option.textContent = _t('data_option_format', { index: formatNumber(i + 1, 0), value: formatNumber(p, 2) });
            editSelect.appendChild(option);
        });
        if (currentSelectedIndexStr !== "" && parseInt(currentSelectedIndexStr) < dataPoints.length) {
            editSelect.value = currentSelectedIndexStr;
            selectedEditIndex = parseInt(currentSelectedIndexStr);
        } else {
            selectedEditIndex = -1;
            editSelect.value = "";
        }
        editSelect.disabled = false;
    }
    updateEditControlsState();
}

function updateEditControlsState() {
    const hasData = dataPoints.length > 0;
    const itemSelected = selectedEditIndex !== -1 && selectedEditIndex < dataPoints.length;

    if (editSelect) editSelect.disabled = !hasData;
    if (editValueEntry) editValueEntry.disabled = !itemSelected;
    if (saveEditButton) saveEditButton.disabled = !itemSelected;
    if (deleteButton) deleteButton.disabled = !itemSelected;

    if (!itemSelected && editValueEntry) editValueEntry.value = "";
}

function loadValueForEditFromMenu(event) {
    selectedEditIndex = event.target.value !== "" ? parseInt(event.target.value, 10) : -1;
     if (selectedEditIndex !== -1 && selectedEditIndex < dataPoints.length) {
        editValueEntry.value = dataPoints[selectedEditIndex].toString(); // No formatting for edit
        editValueEntry.focus();
        editValueEntry.select();
    } else {
         editValueEntry.value = "";
    }
    updateEditControlsState();
}

function saveEditedValue() {
    if (selectedEditIndex === -1 || selectedEditIndex >= dataPoints.length) {
        Swal.fire(_t('warning_title'), _t('status_select_edit'), 'warning');
        updateStatus('status_select_edit', {}, 'warning'); return;
    }
    const newValStr = editValueEntry.value.trim().replace(/%/g, '');
    if (!newValStr) {
        Swal.fire(_t('warning_title'), _t('status_edit_empty'), 'warning');
        updateStatus('status_edit_empty', {}, 'warning'); return;
    }
    const newVal = parseFloat(newValStr.replace(',', '.'));

    if (isNaN(newVal) || !isFinite(newVal)) {
        Swal.fire(_t('error_title'), _t('status_edit_invalid'), 'error');
        updateStatus('status_edit_invalid', {}, 'error'); return;
    }
    try {
        const oldVal = dataPoints[selectedEditIndex];
        dataPoints[selectedEditIndex] = newVal;
        updateDataDisplay();
        updateEditOptions();
        resetResultsDisplay();
        updateActionButtonsState();
        updateStatus('status_data_edited', { index: formatNumber(selectedEditIndex + 1, 0), old_val: formatNumber(oldVal, 2), new_val: formatNumber(newVal, 2) }, 'success');
        editValueEntry.focus();
    } catch (e) {
        console.error("Error saving edited value:", e);
        Swal.fire(_t('error_title'), _t('status_edit_index_error'), 'error');
        updateStatus('status_edit_index_error', {}, 'error');
        selectedEditIndex = -1;
        updateEditOptions();
        updateEditControlsState();
    }
}

function deleteSelectedData() {
    if (selectedEditIndex === -1 || selectedEditIndex >= dataPoints.length) {
        Swal.fire(_t('warning_title'), _t('status_select_delete'), 'warning');
        updateStatus('status_select_delete', {}, 'warning'); return;
    }
    Swal.fire({
        title: _t('delete_button') + ` داده ${formatNumber(selectedEditIndex + 1, 0)}؟`,
        text: _t('data_option_format', {index: formatNumber(selectedEditIndex+1,0), value: formatNumber(dataPoints[selectedEditIndex], 2)}) + " " + _t('confirm_delete_text'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: _t('delete_button'),
        cancelButtonText: _t('cancel_button'),
        customClass: { popup: 'swal2-popup', title: 'swal2-title', htmlContainer: 'swal2-html-container', confirmButton: 'swal2-confirm', cancelButton: 'swal2-cancel'}
    }).then((result) => {
        if (result.isConfirmed) {
            try {
                const deletedVal = dataPoints.splice(selectedEditIndex, 1)[0];
                const deletedIndexHuman = selectedEditIndex + 1;
                selectedEditIndex = -1; if(editValueEntry) editValueEntry.value = '';
                updateDataDisplay(); updateEditOptions(); resetResultsDisplay(); updateEditControlsState(); updateActionButtonsState();
                updateStatus('status_data_deleted', { index: formatNumber(deletedIndexHuman, 0), val: formatNumber(deletedVal, 2) }, 'success');
                Swal.fire(_t('deleted_title'), _t('status_data_deleted', { index: formatNumber(deletedIndexHuman, 0), val: formatNumber(deletedVal, 2) }), 'success');
            } catch (e) {
                console.error("Error deleting data:", e);
                Swal.fire(_t('error_title'), _t('status_delete_index_error'), 'error');
                updateStatus('status_delete_index_error', {}, 'error');
                selectedEditIndex = -1; updateEditOptions(); updateEditControlsState();
            }
        }
    });
}

function clearAssetDataList() {
    clearGenericDataList(dataPoints, 'data_list_title', updateDataDisplay, clearListButton);
    resetResultsDisplay();
    updateActionButtonsState();
    updateEditOptions(); // Also reset edit options
}

// --- Market Data Specific ---
function addMarketDataPoint() {
    const rawInput = marketValueEntry.value.trim();
    const added = addDataPointsToList(rawInput, marketDataPoints, 'add_market_data_title', 'add_market_data_title');
    if (added > 0) {
        updateMarketDataDisplay();
        resetResultsDisplay(); // Market data change invalidates old results
        updateActionButtonsState();
    }
    marketValueEntry.value = '';
    marketValueEntry.focus();
}

function updateMarketDataDisplay() {
    updateGenericDataDisplay(marketDataPoints, marketDataDisplay, 'market_list_empty_option', 'market_data_item_prefix');
    if(clearMarketDataButton) clearMarketDataButton.disabled = marketDataPoints.length === 0;
}

function clearMarketDataPoints() {
    clearGenericDataList(marketDataPoints, 'add_market_data_title', updateMarketDataDisplay, clearMarketDataButton);
    resetResultsDisplay();
    updateActionButtonsState();
}

// --- Benchmark Data Specific ---
function addBenchmarkDataPoint() {
    const rawInput = benchmarkValueEntry.value.trim();
    const added = addDataPointsToList(rawInput, benchmarkDataPoints, 'add_benchmark_data_title', 'add_benchmark_data_title');
    if (added > 0) {
        updateBenchmarkDataDisplay();
        resetResultsDisplay(); // Benchmark data change invalidates old results
        updateActionButtonsState();
    }
    benchmarkValueEntry.value = '';
    benchmarkValueEntry.focus();
}

function updateBenchmarkDataDisplay() {
    updateGenericDataDisplay(benchmarkDataPoints, benchmarkDataDisplay, 'benchmark_list_empty_option', 'benchmark_data_item_prefix');
    if(clearBenchmarkDataButton) clearBenchmarkDataButton.disabled = benchmarkDataPoints.length === 0;
}

function clearBenchmarkDataPoints() {
    clearGenericDataList(benchmarkDataPoints, 'add_benchmark_data_title', updateBenchmarkDataDisplay, clearBenchmarkDataButton);
    resetResultsDisplay();
    updateActionButtonsState();
}

// --- File Import ---
async function processImportedFile(file, targetList, listNameKey, dataTypeTextKey, displayUpdateFunction) {
    if (!file) {
        updateStatus('status_import_cancel', {}, 'warning');
        return;
    }
    updateStatus('status_importing', { filename: file.name, dataType: _t(dataTypeTextKey) }, 'info');

    const allowedTypes = ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'text/plain'];
    const allowedExtensions = /(\.csv|\.xlsx|\.xls|\.txt)$/i;
    const fileNameLower = file.name.toLowerCase();
    const fileType = file.type;
    const isAllowed = allowedTypes.includes(fileType) || allowedExtensions.test(fileNameLower);

    if (!isAllowed) {
        Swal.fire({ title: _t('error_title'), html: _t('invalid_format_msg'), icon: 'error', confirmButtonText: _t('ok_button') });
        updateStatus('status_import_format_error', {}, 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = async function(e) {
        try {
            const fileData = e.target.result;
            let importedData = [];

            if (fileNameLower.endsWith('.txt') || fileType === 'text/plain') {
                const textContent = new TextDecoder().decode(new Uint8Array(fileData));
                const lines = textContent.split(/\r?\n/);
                lines.forEach((line) => {
                    const cleanedLine = line.replace(/%/g, '').trim();
                    if (cleanedLine !== '') {
                        const valueStr = cleanedLine.replace(',', '.');
                        const val = parseFloat(valueStr);
                        if (!isNaN(val) && isFinite(val)) importedData.push(val);
                    }
                });
            } else { // CSV or Excel
                let workbook;
                if (fileNameLower.endsWith('.csv')) {
                    const csvStr = new TextDecoder().decode(new Uint8Array(fileData));
                    workbook = XLSX.read(csvStr, { type: 'string', cellDates: false });
                } else {
                    workbook = XLSX.read(fileData, { type: 'array', cellDates: false });
                }
                if (!workbook || !workbook.SheetNames || workbook.SheetNames.length === 0) throw new Error("Cannot read workbook.");
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: null });
                if (jsonData.length === 0) throw new Error("Sheet is empty.");

                let numericColumnFound = false;
                const numCols = jsonData[0]?.length || 0;
                if (numCols > 0) {
                    for (let j = 0; j < numCols; j++) { // Iterate columns
                        let tempColData = [];
                        let numericCount = 0;
                        for (let i = 0; i < jsonData.length; i++) { // Iterate rows
                            if (jsonData[i] && jsonData[i][j] !== null && jsonData[i][j] !== undefined) {
                                let val;
                                if (typeof jsonData[i][j] === 'number' && isFinite(jsonData[i][j])) {
                                    val = jsonData[i][j];
                                } else if (typeof jsonData[i][j] === 'string') {
                                    const cleanedValue = jsonData[i][j].replace(/%/g, '').trim();
                                    if (cleanedValue !== '') val = parseFloat(cleanedValue.replace(',', '.'));
                                }
                                if (val !== undefined && !isNaN(val) && isFinite(val)) {
                                    tempColData.push(val);
                                    numericCount++;
                                }
                            }
                        }
                        // Heuristic: if more than half the non-empty cells in a column are numeric, use it.
                        const nonEmptyCellsInCol = jsonData.filter(row => row && row[j] !== null && row[j] !== undefined).length;
                        if (nonEmptyCellsInCol > 0 && numericCount >= nonEmptyCellsInCol / 2 && tempColData.length > 0) {
                            importedData = tempColData;
                            numericColumnFound = true;
                            break;
                        }
                    }
                }
                if (!numericColumnFound) throw new Error(_t('status_import_no_numeric', { dataType: _t(dataTypeTextKey) }));
            }

            if (importedData.length > 0) {
                targetList.push(...importedData);
                displayUpdateFunction();
                resetResultsDisplay();
                updateActionButtonsState();
                updateStatus('status_import_success', { count: importedData.length, dataType: _t(dataTypeTextKey) }, 'success');
            } else {
                updateStatus('status_import_no_valid', { dataType: _t(dataTypeTextKey) }, 'error');
                Swal.fire(_t('error_title'), _t('status_import_no_valid', { dataType: _t(dataTypeTextKey) }), 'error');
            }
        } catch (error) {
            console.error(`Error processing file for ${listNameKey}:`, error);
            Swal.fire({ title: _t('error_title'), text: _t('status_import_error', { dataType: _t(dataTypeTextKey) }) + `\n${error.message}`, icon: 'error', confirmButtonText: _t('ok_button') });
            updateStatus('status_import_error', { error: error.message, dataType: _t(dataTypeTextKey) }, 'error');
        }
    };
    reader.onerror = function() {
        Swal.fire({ title: _t('error_title'), text: _t('status_import_error', { dataType: _t(dataTypeTextKey) }), icon: 'error', confirmButtonText: _t('ok_button') });
        updateStatus('status_import_error', { dataType: _t(dataTypeTextKey) }, 'error');
    };
    reader.readAsArrayBuffer(file);
}

function setupDragAndDrop(dropAreaElement, fileInputElement, targetList, listNameKey, dataTypeTextKey, displayUpdateFunction) {
    if (!dropAreaElement) {
        console.warn(`Drop area for ${listNameKey} not found.`);
        return;
    }
    dropAreaElement.addEventListener('click', () => {
        if (fileInputElement) fileInputElement.click();
    });

    if (fileInputElement) {
        fileInputElement.addEventListener('change', async (event) => {
            const files = event.target.files;
            if (files.length > 0) {
                await processImportedFile(files[0], targetList, listNameKey, dataTypeTextKey, displayUpdateFunction);
                event.target.value = null; // Reset file input
            } else {
                updateStatus('status_import_cancel', {}, 'warning');
            }
        });
    }

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropAreaElement.addEventListener(eventName, (event) => {
            event.preventDefault();
            event.stopPropagation();
        });
    });
    dropAreaElement.addEventListener('dragenter', () => dropAreaElement.classList.add('drag-over-active'));
    dropAreaElement.addEventListener('dragover', (event) => {
        dropAreaElement.classList.add('drag-over-active');
        event.dataTransfer.dropEffect = 'copy';
    });
    dropAreaElement.addEventListener('dragleave', (event) => {
        if (!dropAreaElement.contains(event.relatedTarget)) {
            dropAreaElement.classList.remove('drag-over-active');
        }
    });
    dropAreaElement.addEventListener('drop', async (event) => {
        dropAreaElement.classList.remove('drag-over-active');
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            await processImportedFile(files[0], targetList, listNameKey, dataTypeTextKey, displayUpdateFunction);
        } else {
            updateStatus('status_import_cancel', {}, 'warning');
        }
    });
}


// --- Calculation Functions ---
function calculateMean(data) { if (!data || data.length === 0) return NaN; const sum = data.reduce((acc, val) => acc + val, 0); return sum / data.length; }
function calculateStdDev(data, isSample = true) { if (!data || data.length < (isSample ? 2 : 1)) return NaN; const mean = calculateMean(data); if (isNaN(mean)) return NaN; const variance = data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (data.length - (isSample ? 1 : 0)); return Math.sqrt(variance); }
function calculatePercentile(data, percentile) { if (!data || data.length === 0 || percentile < 0 || percentile > 100) return NaN; const sortedData = [...data].sort((a, b) => a - b); const n = sortedData.length; if (percentile === 0) return sortedData[0]; if (percentile === 100) return sortedData[n - 1]; const index = (percentile / 100) * (n - 1); const lowerIndex = Math.floor(index); const upperIndex = Math.ceil(index); const weight = index - lowerIndex; if (lowerIndex === upperIndex) return sortedData[lowerIndex]; else { const lowerValue = sortedData[lowerIndex] ?? sortedData[0]; const upperValue = sortedData[upperIndex] ?? sortedData[n-1]; return lowerValue * (1 - weight) + upperValue * weight; }}
function calculateGeometricMean(data) { if (!data || data.length === 0) return NaN; let product = 1.0; for (const p of data) { const growthFactor = 1 + p / 100.0; if (growthFactor <= 1e-9) return NaN; product *= growthFactor; } if (product < 0 && data.length % 2 !== 0) return NaN; // Avoid complex numbers for odd N with negative product
    return (Math.pow(product, 1.0 / data.length) - 1.0) * 100.0;
}
function calculateDownsideDeviation(data, target = 0) { if (!data || data.length < 2) return NaN; const n = data.length; const downsideReturns = data.filter(r => r < target); if (downsideReturns.length === 0) return 0.0; const sumSqDev = downsideReturns.reduce((acc, r) => acc + Math.pow(r - target, 2), 0); return Math.sqrt(sumSqDev / (n - 1)); } // Using n-1 for sample
function calculateMaxDrawdown(returnsPerc) { if (!returnsPerc || returnsPerc.length === 0) return { maxDrawdown: 0.0, duration: 0, peakIndex: 0, troughIndex: 0 }; const dataArr = returnsPerc.filter(p => isFinite(p)); if (dataArr.length === 0) return { maxDrawdown: 0.0, duration: 0, peakIndex: 0, troughIndex: 0 }; let cumulative = [1.0]; dataArr.forEach(r => { cumulative.push(cumulative[cumulative.length - 1] * (1 + r / 100.0)); }); let maxDd = 0.0; let peakIndexOriginal = 0; let troughIndexOriginal = 0; let currentPeakValue = cumulative[0]; let currentPeakIndexCumulative = 0; for (let i = 1; i < cumulative.length; i++) { if (cumulative[i] > currentPeakValue) { currentPeakValue = cumulative[i]; currentPeakIndexCumulative = i; } else { const currentDrawdown = (currentPeakValue <= 1e-9) ? 0 : (cumulative[i] / currentPeakValue - 1.0) * 100.0; if (currentDrawdown < maxDd) { maxDd = currentDrawdown; peakIndexOriginal = currentPeakIndexCumulative; troughIndexOriginal = i; }}} const duration = troughIndexOriginal - peakIndexOriginal; return { maxDrawdown: isFinite(maxDd) ? maxDd : 0.0, duration: isFinite(duration) ? duration : 0, peakIndex: peakIndexOriginal, troughIndex: troughIndexOriginal -1 };} // troughIndex for data is one less

function calculateRegression(assetReturns, marketReturns) {
    if (!assetReturns || !marketReturns || assetReturns.length !== marketReturns.length || assetReturns.length < 2) {
        console.warn("Regression: Insufficient or mismatched data.");
        return { beta: NaN, alpha: NaN, rSquared: NaN, stdErrRegression: NaN, tStatBeta: NaN, pValBeta: NaN, tStatAlpha: NaN, pValAlpha: NaN };
    }
    if (typeof ss === 'undefined') {
        console.error("simple-statistics (ss) is not loaded. Cannot perform regression.");
        return { beta: NaN, alpha: NaN, rSquared: NaN, stdErrRegression: NaN, tStatBeta: NaN, pValBeta: NaN, tStatAlpha: NaN, pValAlpha: NaN };
    }
    const n = assetReturns.length;
    const pairedData = assetReturns.map((assetRet, i) => [marketReturns[i], assetRet]);

    try {
        const regression = ss.linearRegression(pairedData);
        const beta = regression.m;
        const alpha = regression.b;
        const lineFunc = ss.linearRegressionLine(regression);
        const rSquared = ss.rSquared(pairedData, lineFunc);

        if (n <= 2) { // Not enough data for significance tests
            return { beta, alpha, rSquared, stdErrRegression: NaN, tStatBeta: NaN, pValBeta: NaN, tStatAlpha: NaN, pValAlpha: NaN };
        }
        const residuals = assetReturns.map((y, i) => y - lineFunc(marketReturns[i]));
        const sumSqResiduals = residuals.reduce((sum, r) => sum + r * r, 0);
        const stdErrRegression = Math.sqrt(sumSqResiduals / (n - 2));

        const meanMarket = ss.mean(marketReturns);
        const sumSqDevMarket = marketReturns.reduce((sum, x) => sum + Math.pow(x - meanMarket, 2), 0);

        if (sumSqDevMarket < 1e-9) { // Avoid division by zero
            return { beta, alpha, rSquared, stdErrRegression, tStatBeta: NaN, pValBeta: NaN, tStatAlpha: NaN, pValAlpha: NaN };
        }
        const stdErrBeta = stdErrRegression / Math.sqrt(sumSqDevMarket);
        const tStatBeta = beta / stdErrBeta;
        const stdErrAlpha = stdErrRegression * Math.sqrt((1/n) + (Math.pow(meanMarket, 2) / sumSqDevMarket));
        const tStatAlpha = alpha / stdErrAlpha;
        // P-values are complex, returning NaN. For actual use, a stats library for t-distribution CDF is needed.
        return { beta, alpha, rSquared, stdErrRegression, tStatBeta, pValBeta: NaN, tStatAlpha, pValAlpha: NaN };
    } catch (e) {
        console.error("Error during regression calculation:", e);
        return { beta: NaN, alpha: NaN, rSquared: NaN, stdErrRegression: NaN, tStatBeta: NaN, pValBeta: NaN, tStatAlpha: NaN, pValAlpha: NaN };
    }
}

function calculateTrackingError(assetReturns, benchmarkReturns) {
    if (!assetReturns || !benchmarkReturns || assetReturns.length !== benchmarkReturns.length || assetReturns.length === 0) return NaN;
    const diffReturns = assetReturns.map((ar, i) => ar - benchmarkReturns[i]);
    return calculateStdDev(diffReturns);
}

function calculateInformationRatio(assetReturns, benchmarkReturns) {
    if (!assetReturns || !benchmarkReturns || assetReturns.length !== benchmarkReturns.length || assetReturns.length === 0) return NaN;
    const meanAssetReturn = calculateMean(assetReturns);
    const meanBenchmarkReturn = calculateMean(benchmarkReturns);
    const activeReturn = meanAssetReturn - meanBenchmarkReturn;
    const trackingError = calculateTrackingError(assetReturns, benchmarkReturns);
    if (isNaN(activeReturn) || isNaN(trackingError) || Math.abs(trackingError) < 1e-9) return NaN;
    return activeReturn / trackingError;
}

function calculateCAPMExpectedReturn(rf, beta, expectedMarketReturn) {
    if (isNaN(rf) || isNaN(beta) || isNaN(expectedMarketReturn)) return NaN;
    return rf + beta * (expectedMarketReturn - rf);
}


// --- Main Calculation Orchestration ---
function calculateMetrics() {
    if (dataPoints.length < 2) {
        Swal.fire(_t('warning_title'), _t('status_need_data_calc'), 'warning');
        updateStatus('status_need_data_calc', {}, 'warning');
        resetResultsDisplay();
        if(document.getElementById('result-count')) document.getElementById('result-count').textContent = formatNumber(dataPoints.length, 0);
        updateActionButtonsState();
        return;
    }
    updateStatus('status_calculating', {}, 'info');
    calculatedResults = {};

    try {
        const rfStr = rfRateInput.value.trim().replace(/%/g, '');
        const rfRaw = parseFloat(rfStr.replace(',', '.')) || 0.0;
        if (isNaN(rfRaw) || !isFinite(rfRaw)) {
            Swal.fire(_t('error_title'), _t('status_rf_error'), 'error');
            updateStatus('status_rf_error', {}, 'error'); return;
        }
        calculatedResults['rf'] = rfRaw;

        const emrStr = expectedMarketReturnInput.value.trim().replace(/%/g, '');
        const emrRaw = parseFloat(emrStr.replace(',', '.')) || 0.0;
         if (isNaN(emrRaw) || !isFinite(emrRaw)) {
            Swal.fire(_t('error_title'), _t('status_expected_market_return_error'), 'error');
            updateStatus('status_expected_market_return_error', {}, 'error'); return;
        }
        calculatedResults['expectedMarketReturn'] = emrRaw;


        const data = dataPoints.filter(p => isFinite(p));
        const n = data.length;
        calculatedResults['n'] = n;
        calculatedResults['data'] = data;

        if (n < 2) { /* Redundant check, but safe */ throw new Error(_t('status_need_data_calc')); }

        calculatedResults['mean'] = calculateMean(data);
        calculatedResults['std'] = calculateStdDev(data);
        calculatedResults['var'] = Math.pow(calculatedResults.std, 2);
        calculatedResults['median'] = calculatePercentile(data, 50);
        calculatedResults['gm'] = calculateGeometricMean(data);
        calculatedResults['dsd'] = calculateDownsideDeviation(data, 0); // Target 0
        calculatedResults['cv'] = (Math.abs(calculatedResults.mean) > 1e-9) ? calculatedResults.std / Math.abs(calculatedResults.mean) : NaN;
        const mddResult = calculateMaxDrawdown(data);
        calculatedResults['mdd'] = mddResult.maxDrawdown;
        calculatedResults['mdd_period'] = mddResult.duration;

        let sk = NaN, ku = NaN;
        if (typeof ss !== 'undefined' && n >=3 && !isNaN(calculatedResults.std) && calculatedResults.std > 1e-9) {
            try { sk = ss.sampleSkewness(data); } catch (e) { console.warn("Skewness calc failed:", e); }
            try { ku = ss.sampleKurtosis(data); } catch (e) { console.warn("Kurtosis calc failed:", e); } // This is excess kurtosis
        } else if (n > 0 && (!isNaN(calculatedResults.std) && calculatedResults.std <= 1e-9)) { sk = 0.0; ku = -3.0; } // Constant data
        calculatedResults['skew'] = sk;
        calculatedResults['kurt'] = ku;

        calculatedResults['var5'] = calculatePercentile(data, 5);
        calculatedResults['var95'] = calculatePercentile(data, 95);
        calculatedResults['max_gain'] = (n > 0) ? Math.max(...data) : NaN;
        calculatedResults['sh'] = (Math.abs(calculatedResults.std) > 1e-9) ? (calculatedResults.mean - rfRaw) / calculatedResults.std : NaN;
        let sortino = NaN;
        if (Math.abs(calculatedResults.dsd) > 1e-9) {
            sortino = (calculatedResults.mean - rfRaw) / calculatedResults.dsd;
        } else if (calculatedResults.dsd === 0) {
            sortino = (calculatedResults.mean - rfRaw > 1e-9) ? Infinity : ((calculatedResults.mean - rfRaw < -1e-9) ? -Infinity : 0);
        }
        calculatedResults['so'] = sortino;

        let cvar5 = NaN;
        if (!isNaN(calculatedResults.var5) && n > 0) {
            const shortfallReturns = data.filter(r => r <= calculatedResults.var5);
            if (shortfallReturns.length > 0) cvar5 = calculateMean(shortfallReturns);
            else cvar5 = calculatedResults.var5;
        }
        calculatedResults['cvar5'] = cvar5;

        let omega = NaN;
        if (n > 0) {
            const gains = data.filter(r => r > rfRaw).reduce((sum, r) => sum + (r - rfRaw), 0);
            const losses = data.filter(r => r < rfRaw).reduce((sum, r) => sum + (rfRaw - r), 0);
            if (losses === 0) omega = (gains > 0) ? Infinity : 1;
            else omega = gains / losses;
        }
        calculatedResults['omega'] = omega;

        // Regression & CAPM
        const marketDataFiltered = marketDataPoints.filter(p => isFinite(p));
        if (marketDataFiltered.length === data.length && data.length >= 2) {
            const regResults = calculateRegression(data, marketDataFiltered);
            calculatedResults = { ...calculatedResults, ...regResults }; // Merge regression results
            calculatedResults['capmExpectedReturn'] = calculateCAPMExpectedReturn(rfRaw, regResults.beta, emrRaw);
        } else {
            ['beta', 'alpha', 'rSquared', 'regStdErr', 'betaTStat', 'betaPValue', 'alphaTStat', 'alphaPValue', 'capmExpectedReturn'].forEach(k => calculatedResults[k] = NaN);
        }

        // Benchmark Analysis
        const benchmarkDataFiltered = benchmarkDataPoints.filter(p => isFinite(p));
        if (benchmarkDataFiltered.length === data.length && data.length > 0) {
            calculatedResults['trackingError'] = calculateTrackingError(data, benchmarkDataFiltered);
            calculatedResults['informationRatio'] = calculateInformationRatio(data, benchmarkDataFiltered);
        } else {
            calculatedResults['trackingError'] = NaN;
            calculatedResults['informationRatio'] = NaN;
        }

        updateResultsUI();
        updateActionButtonsState();
        updateStatus('status_calc_done', {}, 'success');

    } catch (error) {
        console.error("Error during calculation:", error);
        Swal.fire(_t('error_title'), _t('status_calc_error', { error: error.message || 'Unknown error' }), 'error');
        updateStatus('status_calc_error', { error: error.message || 'Unknown error' }, 'error');
        resetResultsDisplay();
        updateActionButtonsState();
    }
}

// --- UI Update Functions ---
function resetResultsDisplay() {
    if (!resultsDisplayDiv) return;
    resultsDisplayDiv.querySelectorAll('span[id^="result-"]').forEach(span => {
        span.textContent = _t('value_invalid');
        span.className = 'font-mono text-dark-text-muted'; // Reset class
    });
    // Ensure count is also reset or set to current dataPoints length
    const countSpan = document.getElementById('result-count');
    if (countSpan) countSpan.textContent = formatNumber(dataPoints.length, 0);
}

function updateResultsUI() {
    if (!resultsDisplayDiv || Object.keys(calculatedResults).length === 0) {
        resetResultsDisplay(); // Call reset if no results
        return;
    }
    const results = calculatedResults;
    const updateSpan = (id, value, options, highlightType = 'neutral') => {
        const span = document.getElementById(id);
        if (span) {
            const formattedValue = formatNumber(value, options?.digits, options?.addPercent);
            span.textContent = formattedValue;
            span.className = 'font-mono '; // Base class

            if (formattedValue !== _t('value_invalid')) {
                if (highlightType === 'pos' && value > 0) span.classList.add('text-highlight-pos');
                else if (highlightType === 'neg' && value < 0) span.classList.add('text-highlight-neg');
                else if (highlightType === 'neutral' && value !== 0) span.classList.add('text-highlight-neutral');
                else if (highlightType === 'posneg') span.classList.add(value >= 0 ? 'text-highlight-pos' : 'text-highlight-neg');
                else span.classList.add('text-dark-text');
            } else {
                span.classList.add('text-dark-text-muted');
            }
        }
    };

    updateSpan('result-count', results.n, {digits:0});
    updateSpan('result-mean', results.mean, {digits:2, addPercent:true}, 'posneg');
    updateSpan('result-gm', results.gm, {digits:2, addPercent:true}, 'posneg');
    updateSpan('result-std', results.std, {digits:2, addPercent:true}, 'neutral');
    updateSpan('result-dsd', results.dsd, {digits:2, addPercent:true}, 'neutral');
    updateSpan('result-var', results.var, {digits:4});
    updateSpan('result-cv', results.cv, {digits:3}, 'neutral');
    updateSpan('result-mdd', results.mdd, {digits:2, addPercent:true}, 'neg');
    updateSpan('result-mdd-period', results.mdd_period, {digits:0});
    updateSpan('result-skew', results.skew, {digits:3}, 'posneg');
    updateSpan('result-kurt', results.kurt, {digits:3}, 'neutral');
    updateSpan('result-var5', results.var5, {digits:2, addPercent:true}, 'neg');
    updateSpan('result-var95', results.var95, {digits:2, addPercent:true}, 'pos');
    updateSpan('result-cvar5', results.cvar5, {digits:2, addPercent:true}, 'neg');
    updateSpan('result-max-gain', results.max_gain, {digits:2, addPercent:true}, 'pos');
    updateSpan('result-sharpe', results.sh, {digits:3}, 'neutral');
    updateSpan('result-sortino', results.so, {digits:3}, 'neutral');
    updateSpan('result-omega', results.omega, {digits:3}, 'neutral');

    // Benchmark Analysis
    updateSpan('result-tracking-error', results.trackingError, {digits:2, addPercent:true}, 'neutral');
    updateSpan('result-information-ratio', results.informationRatio, {digits:3}, 'neutral');

    // Regression (CAPM)
    updateSpan('result-beta', results.beta, {digits:3}, 'neutral');
    updateSpan('result-alpha', results.alpha, {digits:3, addPercent:true}, 'posneg'); // Alpha often shown as %
    updateSpan('result-rsquared', results.rSquared, {digits:3});
    updateSpan('result-capm-er', results.capmExpectedReturn, {digits:2, addPercent:true}, 'posneg');
    updateSpan('result-reg-stderr', results.regStdErr, {digits:3, addPercent:true}, 'neutral');
    updateSpan('result-beta-tstat', results.betaTStat, {digits:2}, 'neutral');
    updateSpan('result-beta-pvalue', results.betaPValue, {digits:3});
    updateSpan('result-alpha-tstat', results.alphaTStat, {digits:2}, 'neutral');
    updateSpan('result-alpha-pvalue', results.alphaPValue, {digits:3});
}

function updateActionButtonsState() {
    const hasAssetData = dataPoints.length > 0;
    const hasEnoughAssetDataForCalc = dataPoints.length >= 2;
    const hasResults = calculatedResults && typeof calculatedResults.mean === 'number' && isFinite(calculatedResults.mean);
    const hasRegressionParams = hasResults && typeof calculatedResults.beta === 'number' && isFinite(calculatedResults.beta);

    if (calculateButton) calculateButton.disabled = !hasEnoughAssetDataForCalc;
    if (plotHistButton) plotHistButton.disabled = !hasResults;
    if (plotBoxButton) plotBoxButton.disabled = !hasResults;
    if (plotEquityButton) plotEquityButton.disabled = !hasResults;
    if (plotQqButton) plotQqButton.disabled = !(hasResults && dataPoints.length >=2); // QQ needs at least 2 points
    if (plotRegressionButton) plotRegressionButton.disabled = !hasRegressionParams;
    if (exportResultsButton) exportResultsButton.disabled = !hasResults;
    if (clearListButton) clearListButton.disabled = !hasAssetData;
}

// --- Plotting (Placeholders, actual implementation in previous responses) ---
const DARK_BACKGROUND_COLOR = '#111827'; const DARK_CARD_COLOR = '#1f2937'; const DARK_TEXT_COLOR = '#d1d5db'; const DARK_MUTED_COLOR = '#9ca3af'; const DARK_BORDER_COLOR = '#374151'; const PRIMARY_COLOR = '#3b82f6'; const ACCENT_COLOR_NEG = '#f87171'; const ACCENT_COLOR_POS = '#34d399'; const ACCENT_COLOR_MEAN = '#fbbf24'; const ACCENT_COLOR_MEDIAN = '#60a5fa'; const ACCENT_COLOR_FIT = '#a78bfa'; const ACCENT_COLOR_KDE = '#14b8a6'; const ACCENT_COLOR_EQUITY = '#22c55e';
const HIST_NORM_FIT_COLOR = '#673ab7'; const HIST_KDE_COLOR = '#818cf8'; const HIST_MEAN_LINE_COLOR = '#facc15'; const HIST_MEDIAN_LINE_COLOR = '#38bdf8'; const HIST_VAR_LINE_COLOR = '#f87171'; const HIST_GAIN_LINE_COLOR = '#34d399';

function getResponsiveLayoutParams() { /* ... from previous script ... */
    const isMobile = window.innerWidth < 768;
    const baseFontSize = isMobile ? 9 : 11;
    return {
        baseFontSize: baseFontSize,
        titleFontSize: isMobile ? 13 : 16,
        margin: isMobile ? { l: 45, r: 15, t: 40, b: 60, pad:2 } : { l: 60, r: 25, t: 50, b: 60, pad:4 },
        legend: { font: { size: baseFontSize -1 }, x: isMobile ? 0.5 : 1.02, y: isMobile ? -0.30 : 0.98, xanchor: isMobile ? 'center' : 'left', yanchor: 'top', orientation: isMobile ? 'h' : 'v', bgcolor: 'rgba(31, 41, 55, 0.7)', bordercolor: DARK_BORDER_COLOR, borderwidth: 1, itemclick: "toggleothers", itemdoubleclick: "toggle" },
        nbinsxHist: (n) => Math.min(Math.max(10, Math.floor(window.innerWidth / (isMobile ? 25 : 35))), Math.ceil(n/1.5)+1, isMobile ? 30 : 50),
        markerSize: isMobile ? 5 : 6,
        lineWidth: isMobile ? 1.8 : 2,
        tickAngle: isMobile ? 35 : 'auto',
    };
}

function plotActionWrapper(plotFunc, titleKey) {
    if (dataPoints.length === 0 && plotFunc.name !== 'plotRegressionLogic') { // Regression might plot with only market/asset if params are there
        Swal.fire(_t('warning_title'), _t('status_need_data_plot'), 'warning');
        updateStatus('status_need_data_plot', {}, 'warning'); return;
    }
    const currentAssetData = dataPoints.filter(p => isFinite(p));

    if (plotFunc.name !== 'plotRegressionLogic' && (Object.keys(calculatedResults).length === 0 || !calculatedResults.data || calculatedResults.n !== currentAssetData.length)) {
        if (currentAssetData.length < (plotFunc.name === 'plotQqplotLogic' ? 2 : 1)) {
            Swal.fire(_t('warning_title'), _t(plotFunc.name === 'plotQqplotLogic' ? 'status_need_data_calc' : 'status_need_data_plot'), 'warning'); return;
        }
        calculateMetrics(); // Recalculate if results are stale or missing
        if (!calculatedResults.data) { console.log("Plot cancelled: metric calculation failed."); return; }
    }

    const dataForPlot = calculatedResults.data || currentAssetData; // Use calculated data if available

    if (plotFunc.name !== 'plotRegressionLogic' && (!dataForPlot || dataForPlot.length === 0 || (plotFunc.name === 'plotQqplotLogic' && dataForPlot.length < 2))) {
         Swal.fire(_t('warning_title'), _t('status_need_data_plot'), 'warning'); return;
    }

    updateStatus(texts[titleKey] ? `status_plotting_${titleKey.split('_')[1]}` : 'status_plotting_hist', {}, 'info');

    try {
        let plotDefinition;
        if (plotFunc.name === 'plotRegressionLogic') {
            if (!calculatedResults.beta || !calculatedResults.alpha || marketDataPoints.length !== dataPoints.length) {
                 Swal.fire(_t('error_title'), _t('status_plot_error_no_regression_params'), 'error'); return;
            }
            plotDefinition = plotFunc(dataPoints, marketDataPoints, {alpha: calculatedResults.alpha, beta: calculatedResults.beta});
        } else {
            plotDefinition = plotFunc(dataForPlot);
        }

        if (!plotDefinition || !plotDefinition.plotData || !plotDefinition.layout) throw new Error(_t('plotFailed'));
        const { plotData, layout } = plotDefinition;

        layout.autosize = true; layout.uirevision = 'dataset';
        if(plotModalLabel) plotModalLabel.textContent = _t(titleKey);
        if(plotContainer) Plotly.purge(plotContainer); else throw new Error("Plot container missing.");

        Plotly.newPlot(plotContainer, plotData, layout, {responsive: true, displaylogo: false, modeBarButtonsToRemove: ['sendDataToCloud', 'editInChartStudio']})
        .then(() => {
            if (plotModal) {
                 plotModal.classList.remove('hidden'); plotModal.classList.add('flex'); document.body.style.overflow = 'hidden';
            }
            updateStatus('status_plot_done', {}, 'success');
        }).catch(err => { throw err; });

    } catch (error) {
        console.error("Plotting Error:", error);
        Swal.fire(_t('error_title'), _t('status_plot_error', { error: error.message }), 'error');
        updateStatus('status_plot_error', { error: error.message }, 'error');
        if(plotModal) { plotModal.classList.add('hidden'); plotModal.classList.remove('flex'); document.body.style.overflow = 'auto'; }
    }
}
function plotHistogramLogic(data) { /* ... from previous script, ensure it uses responsiveParams ... */
    if (data.length === 0) throw new Error(_t('noDataPlot'));
    const responsiveParams = getResponsiveLayoutParams();
    const n = data.length;
    const mean = calculatedResults.mean ?? calculateMean(data);
    const median = calculatedResults.median ?? calculatePercentile(data, 50);
    const std = calculatedResults.std ?? calculateStdDev(data);
    const var_5 = calculatedResults.var5 ?? calculatePercentile(data, 5);
    const var_95 = calculatedResults.var95 ?? calculatePercentile(data, 95);
    const nbins = responsiveParams.nbinsxHist(n);

    const traceHist = { x: data, type: 'histogram', name: _t('hist_label_main'), histnorm: 'probability density', autobinx: false, nbinsx: nbins, marker: { color: PRIMARY_COLOR, line: { color: DARK_BORDER_COLOR, width: 0.5 } }, opacity: 0.75, hoverlabel: { bgcolor: DARK_BACKGROUND_COLOR, bordercolor: PRIMARY_COLOR, font: { color: DARK_TEXT_COLOR } }, hovertemplate: `${_t('hist_hover_value')}: %{x:.2f}%<br>${_t('plot_ylabel_hist_density')}: %{y:.4f}<extra></extra>` };
    const plotData = [traceHist]; const shapes = [];

    if (n > 1 && !isNaN(mean) && !isNaN(std) && std > 1e-9) {
        const xMin = Math.min(...data); const xMax = Math.max(...data); const range = xMax - xMin;
        const xNorm = []; const yNormPDF = []; const step = range / 200 || 0.05;
        let curveStartX = Math.min(xMin, mean - 3.5 * std); let curveEndX = Math.max(xMax, mean + 3.5 * std);
        if (range === 0) { curveStartX = mean - 1; curveEndX = mean + 1; }
        for (let x = curveStartX; x <= curveEndX; x += step) { xNorm.push(x); yNormPDF.push((1 / (std * Math.sqrt(2 * Math.PI))) * Math.exp(-Math.pow(x - mean, 2) / (2 * Math.pow(std, 2)))); }
        plotData.push({ x: xNorm, y: yNormPDF, type: 'scatter', mode: 'lines', name: _t('plot_norm_label', { mean: formatNumber(mean, 2), std: formatNumber(std, 2) }), line: { color: HIST_NORM_FIT_COLOR, dash: 'dashdot', width: responsiveParams.lineWidth }, hoverinfo: 'name' });
    }
    if (n > 1 && typeof ss !== 'undefined' && typeof ss.kernelDensityEstimation === 'function') {
        try {
            const kdePoints = ss.kernelDensityEstimation(data); // Default bandwidth
            if (kdePoints && kdePoints.length > 0 && kdePoints[0].length === 2) { // Check structure
                 const xKde = kdePoints.map(p => p[0]); const yKde = kdePoints.map(p => p[1]);
                 if (xKde.length > 0 && yKde.length > 0) {
                    plotData.push({ x: xKde, y: yKde, type: 'scatter', mode: 'lines', name: _t('plot_kde_label'), line: { color: HIST_KDE_COLOR, width: responsiveParams.lineWidth, dash: 'longdash' }, hoverinfo: 'name' });
                 }
            } else { console.warn("KDE output format unexpected or empty."); }
        } catch (kdeError) { console.warn("Error calculating KDE:", kdeError); }
    }
    const addVLine = (val, color, dash, name) => { if(!isNaN(val) && isFinite(val)) { shapes.push({type:'line',x0:val,x1:val,y0:0,y1:1,yref:'paper',line:{color,width:responsiveParams.lineWidth,dash}}); plotData.push({x:[null],y:[null],mode:'lines',name,line:{color,width:responsiveParams.lineWidth+1,dash}});}};
    addVLine(mean, HIST_MEAN_LINE_COLOR, 'solid', _t('plot_mean_val_label',{val:formatNumber(mean,2)}));
    addVLine(median, HIST_MEDIAN_LINE_COLOR, 'dash', _t('plot_median_val_label',{val:formatNumber(median,2)}));
    addVLine(var_5, HIST_VAR_LINE_COLOR, 'dot', _t('plot_var_label',{val:formatNumber(var_5,2)}));
    addVLine(var_95, HIST_GAIN_LINE_COLOR, 'dot', _t('plot_gain_label',{val:formatNumber(var_95,2)}));

    const layout = { title: { text: _t('plot_hist_title'), font: { size: responsiveParams.titleFontSize, color: DARK_TEXT_COLOR }, x: 0.5, xanchor: 'center' }, xaxis: { title: { text: _t('plot_xlabel'), font: { size: responsiveParams.baseFontSize, color: DARK_TEXT_COLOR } }, color: DARK_TEXT_COLOR, gridcolor: DARK_BORDER_COLOR, zerolinecolor: DARK_MUTED_COLOR, showgrid: true, tickformat: ',.1f', tickfont: { size: responsiveParams.baseFontSize - 1, color: DARK_TEXT_COLOR }, tickangle: responsiveParams.tickAngle }, yaxis: { title: { text: _t('plot_ylabel_hist_density'), font: { size: responsiveParams.baseFontSize, color: DARK_TEXT_COLOR } }, color: DARK_TEXT_COLOR, gridcolor: DARK_BORDER_COLOR, showgrid: true, tickfont: { size: responsiveParams.baseFontSize - 1, color: DARK_TEXT_COLOR } }, plot_bgcolor: DARK_CARD_COLOR, paper_bgcolor: DARK_BACKGROUND_COLOR, font: { color: DARK_TEXT_COLOR, size: responsiveParams.baseFontSize }, showlegend: true, legend: responsiveParams.legend, shapes: shapes, bargap: 0.05, barmode: 'overlay', margin: responsiveParams.margin, hovermode: 'x unified' };
    return { plotData, layout };
}
function plotBoxplotLogic(data) { /* ... from previous script, ensure it uses responsiveParams ... */
    if (data.length === 0) throw new Error(_t('noDataPlot'));
    const responsiveParams = getResponsiveLayoutParams();
    const mean = calculateMean(data); const std = calculateStdDev(data);
    const q1 = calculatePercentile(data,25); const median = calculatePercentile(data,50); const q3 = calculatePercentile(data,75);
    const iqr = q3-q1; const upperFence = q3 + 1.5 * iqr; const lowerFence = q1 - 1.5 * iqr;
    const dataMax = Math.max(...data); const dataMin = Math.min(...data);
    const effectiveMax = Math.min(dataMax, upperFence); const effectiveMin = Math.max(dataMin, lowerFence);

    const traceBox = { y: data, type: 'box', name: ' ', boxpoints: 'all', jitter: 0.3, pointpos: -1.8, marker: { color: PRIMARY_COLOR, size: responsiveParams.markerSize -1, opacity: 0.6, line: { color: DARK_BORDER_COLOR, width: 0.5 } }, line: { color: DARK_TEXT_COLOR, width: responsiveParams.lineWidth }, fillcolor: 'rgba(59, 130, 246, 0.3)', hoverinfo: 'y',
        hovertemplate: `<b>${_t('boxplot_hover_stats')}</b><br>${_t('boxplot_hover_max')}: ${formatNumber(effectiveMax,2)}%<br>${_t('boxplot_hover_q3')}: %{q3:.2f}%<br>${_t('boxplot_hover_median')}: %{median:.2f}%<br>${_t('boxplot_hover_q1')}: %{q1:.2f}%<br>${_t('boxplot_hover_min')}: ${formatNumber(effectiveMin,2)}%<br>${_t('boxplot_hover_mean')}: ${formatNumber(mean,2)}%<br>${_t('boxplot_hover_std')}: ${formatNumber(std,2)}%<extra></extra>`,
        boxmean: 'sd', whiskerwidth: 0.6,
    };
    const plotData = [traceBox];
    const layout = { title: { text: _t('plot_box_title'), font: { size: responsiveParams.titleFontSize, color: DARK_TEXT_COLOR }, x: 0.5, xanchor: 'center' }, yaxis: { title: { text: _t('plot_ylabel_box'), font: { size: responsiveParams.baseFontSize, color: DARK_TEXT_COLOR } }, color: DARK_TEXT_COLOR, gridcolor: DARK_BORDER_COLOR, zerolinecolor: DARK_MUTED_COLOR, zeroline: true, showgrid: true, tickformat: ',.1f', tickfont: { size: responsiveParams.baseFontSize - 1, color: DARK_TEXT_COLOR } }, xaxis: { showticklabels: false, zeroline: false, showgrid: false }, plot_bgcolor: DARK_CARD_COLOR, paper_bgcolor: DARK_BACKGROUND_COLOR, font: { color: DARK_TEXT_COLOR, size: responsiveParams.baseFontSize }, showlegend: false, margin: responsiveParams.margin };
    return { plotData, layout };
}
function plotEquityCurveLogic(data) { /* ... from previous script, ensure it uses responsiveParams ... */
    if (data.length === 0) throw new Error(_t('noDataPlot'));
    const responsiveParams = getResponsiveLayoutParams(); const initialInvestment = 100;
    const equityCurve = [initialInvestment]; let highWaterMark = initialInvestment; const highWaterMarkData = [initialInvestment]; const drawdowns = [0];
    for (let i = 0; i < data.length; i++) { const currentReturn = data[i]; const previousValue = equityCurve[equityCurve.length - 1]; const newValue = previousValue * (1 + (isFinite(currentReturn) ? currentReturn : 0) / 100.0); equityCurve.push(newValue); if (newValue > highWaterMark) highWaterMark = newValue; highWaterMarkData.push(highWaterMark); drawdowns.push(((newValue / highWaterMark) - 1) * 100); }
    const indices = Array.from({ length: equityCurve.length }, (_, i) => i);
    const mddResult = calculateMaxDrawdown(data); const mddShapes = [];
    if (mddResult && typeof mddResult.peakIndex === 'number' && typeof mddResult.troughIndex === 'number' && mddResult.duration > 0) {
        const mddPeakX = indices[mddResult.peakIndex]; const mddTroughX = indices[mddResult.troughIndex + 1]; // +1 because troughIndex is for data, equity curve has initial point
        if (mddPeakX !== undefined && mddTroughX !== undefined && mddPeakX < mddTroughX) { // Ensure peak is before trough for rect
            mddShapes.push({ type: 'rect', xref: 'x', yref: 'paper', x0: mddPeakX, y0: 0, x1: mddTroughX, y1: 1, fillcolor: 'rgba(248, 113, 113, 0.15)', layer: 'below', line: { width: 0 } });
        }
    }
    const plotData = [];
    plotData.push({ x: indices, y: equityCurve, type: 'scatter', mode: 'lines', name: _t('equity_curve_label'), line: { color: ACCENT_COLOR_EQUITY, width: responsiveParams.lineWidth + 0.5 }, hoverinfo: 'x+y', hovertemplate: `<b>${_t('period_label')}:</b> %{x}<br><b>${_t('equity_value_label')}:</b> %{y:.2f}<br><b>${_t('hwm_label')}:</b> %{customdata[0]:.2f}<br><b>${_t('drawdown_from_hwm_label')}:</b> %{customdata[1]:.2f}%<extra></extra>`, customdata: highWaterMarkData.map((hwm, i) => [hwm, drawdowns[i]]), legendgroup: 'equity' });
    plotData.push({ x: indices, y: highWaterMarkData, type: 'scatter', mode: 'lines', name: _t('hwm_trace_label'), line: { color: ACCENT_COLOR_POS, dash: 'dash', width: responsiveParams.lineWidth - 0.2 }, hoverinfo: 'skip', legendgroup: 'equity' });
    const layout = { title: { text: _t('plot_equity_title'), font: { size: responsiveParams.titleFontSize, color: DARK_TEXT_COLOR }, x: 0.5, xanchor: 'center' }, xaxis: { title: { text: _t('plot_xlabel_equity'), font: { size: responsiveParams.baseFontSize, color: DARK_TEXT_COLOR } }, color: DARK_TEXT_COLOR, gridcolor: DARK_BORDER_COLOR, zeroline: false, showgrid: true, tickfont: { size: responsiveParams.baseFontSize - 1, color: DARK_TEXT_COLOR }, tickangle: responsiveParams.tickAngle, range: [0, data.length] }, yaxis: { title: { text: _t('plot_ylabel_equity_value'), font: { size: responsiveParams.baseFontSize, color: DARK_TEXT_COLOR } }, color: DARK_TEXT_COLOR, gridcolor: DARK_BORDER_COLOR, zeroline: false, showgrid: true, tickformat: ',', tickfont: { size: responsiveParams.baseFontSize - 1, color: DARK_TEXT_COLOR } }, plot_bgcolor: DARK_CARD_COLOR, paper_bgcolor: DARK_BACKGROUND_COLOR, font: { color: DARK_TEXT_COLOR, size: responsiveParams.baseFontSize }, showlegend: true, legend: responsiveParams.legend, shapes: mddShapes, margin: responsiveParams.margin, hovermode: 'x unified' };
    return { plotData, layout };
}
function plotQqplotLogic(data) { /* ... from previous script, ensure it uses responsiveParams ... */
    if (data.length < 2) throw new Error(_t('status_qq_insufficient_points'));
    if (typeof ss === 'undefined' || typeof ss.probit !== 'function') throw new Error(_t('error_lib_missing', {lib: 'simple-statistics'}));
    const responsiveParams = getResponsiveLayoutParams();
    const sortedData = [...data].sort((a, b) => a - b); const n = sortedData.length; const theoreticalQuantiles = [];
    for (let i = 0; i < n; i++) { const p = (i + 1 - 0.5) / n; const safeP = Math.max(1e-9, Math.min(1 - 1e-9, p)); try { theoreticalQuantiles.push(ss.probit(safeP)); } catch (e) { theoreticalQuantiles.push(NaN); }}
    const validPairs = sortedData.map((s, i) => ({sample: s, theoretical: theoreticalQuantiles[i]})).filter(p => isFinite(p.theoretical) && isFinite(p.sample));
    if (validPairs.length < 2) throw new Error(_t('status_qq_insufficient_points'));
    const sampleQ = validPairs.map(p => p.sample); const theoreticalQ = validPairs.map(p => p.theoretical);
    const traceScatter = { x: theoreticalQ, y: sampleQ, mode: 'markers', type: 'scatter', name: _t('qq_data_quantiles_label'), marker: { color: PRIMARY_COLOR, size: responsiveParams.markerSize, opacity: 0.7, line: { color: DARK_BORDER_COLOR, width: 0.5 } }, hovertemplate: `<b>${_t('qq_hover_point')}</b><br>${_t('qq_hover_theoretical')}: %{x:.3f}<br>${_t('qq_hover_sample')}: %{y:.2f}%<extra></extra>` };
    let lineX = [], lineY = []; const minTheo = Math.min(...theoreticalQ); const maxTheo = Math.max(...theoreticalQ);
    const q1Sample = calculatePercentile(sampleQ, 25); const q3Sample = calculatePercentile(sampleQ, 75);
    const q1Theoretical = ss.probit(0.25); const q3Theoretical = ss.probit(0.75); // Use exact percentiles for theoretical
    if (isFinite(q1Sample) && isFinite(q3Sample) && isFinite(q1Theoretical) && isFinite(q3Theoretical) && (q3Theoretical - q1Theoretical !== 0)) { const slope = (q3Sample - q1Sample) / (q3Theoretical - q1Theoretical); const intercept = q1Sample - slope * q1Theoretical; lineX = [minTheo, maxTheo]; lineY = [intercept + slope * minTheo, intercept + slope * maxTheo]; }
    const traceLine = { x: lineX, y: lineY, mode: 'lines', type: 'scatter', name: _t('qq_norm_ref_line_label'), line: { color: ACCENT_COLOR_NEG, width: responsiveParams.lineWidth, dash: 'dash' }, hoverinfo: 'name' };
    const plotData = [traceScatter]; if (lineX.length > 0) plotData.push(traceLine);
    const layout = { title: { text: _t('plot_qq_title'), font: { size: responsiveParams.titleFontSize, color: DARK_TEXT_COLOR }, x: 0.5, xanchor: 'center' }, xaxis: { title: { text: _t('plot_qq_xlabel'), font: { size: responsiveParams.baseFontSize, color: DARK_TEXT_COLOR } }, color: DARK_TEXT_COLOR, gridcolor: DARK_BORDER_COLOR, zeroline: true, zerolinecolor: DARK_MUTED_COLOR, tickfont: { size: responsiveParams.baseFontSize - 1, color: DARK_TEXT_COLOR }, tickangle: responsiveParams.tickAngle, range: [Math.min(-3.5, minTheo - 0.5), Math.max(3.5, maxTheo + 0.5)] }, yaxis: { title: { text: _t('plot_qq_ylabel'), font: { size: responsiveParams.baseFontSize, color: DARK_TEXT_COLOR } }, color: DARK_TEXT_COLOR, gridcolor: DARK_BORDER_COLOR, zeroline: true, zerolinecolor: DARK_MUTED_COLOR, tickformat: ',.1f', tickfont: { size: responsiveParams.baseFontSize - 1, color: DARK_TEXT_COLOR } }, plot_bgcolor: DARK_CARD_COLOR, paper_bgcolor: DARK_BACKGROUND_COLOR, font: { color: DARK_TEXT_COLOR, size: responsiveParams.baseFontSize }, showlegend: true, legend: responsiveParams.legend, margin: responsiveParams.margin, hovermode: 'closest' };
    return { plotData, layout };
}
function plotRegressionLogic(assetReturns, marketReturns, regressionParams) { /* ... from previous script, ensure it uses responsiveParams ... */
    if (!assetReturns || !marketReturns || assetReturns.length !== marketReturns.length || assetReturns.length === 0) { Swal.fire(_t('error_title'), _t('status_plot_error_no_paired_data'), 'error'); return null; }
    if (!regressionParams || typeof regressionParams.alpha !== 'number' || typeof regressionParams.beta !== 'number') { Swal.fire(_t('error_title'), _t('status_plot_error_no_regression_params'), 'error'); return null; }
    const { alpha, beta } = regressionParams; const responsiveParams = getResponsiveLayoutParams();
    const traceScatter = { x: marketReturns, y: assetReturns, mode: 'markers', type: 'scatter', name: _t('scatter_plot_legend_actual'), marker: { color: PRIMARY_COLOR, size: responsiveParams.markerSize, opacity: 0.7 } };
    const minMarket = Math.min(...marketReturns); const maxMarket = Math.max(...marketReturns);
    const lineX = [minMarket, maxMarket]; const lineY = [alpha + beta * minMarket, alpha + beta * maxMarket];
    const traceLine = { x: lineX, y: lineY, mode: 'lines', type: 'scatter', name: _t('scatter_plot_legend_regression_line', {alpha: formatNumber(alpha,2), beta: formatNumber(beta,3)}), line: { color: ACCENT_COLOR_NEG, width: responsiveParams.lineWidth } };
    const plotData = [traceScatter, traceLine];
    const layout = { title: { text: _t('plot_regression_title'), font: { size: responsiveParams.titleFontSize, color: DARK_TEXT_COLOR }, x: 0.5, xanchor: 'center' }, xaxis: { title: { text: _t('plot_axis_market_returns'), font: { size: responsiveParams.baseFontSize, color: DARK_TEXT_COLOR } }, color: DARK_TEXT_COLOR, gridcolor: DARK_BORDER_COLOR, zeroline: true, zerolinecolor: DARK_MUTED_COLOR, tickfont: { size: responsiveParams.baseFontSize - 1, color: DARK_TEXT_COLOR } }, yaxis: { title: { text: _t('plot_axis_asset_returns'), font: { size: responsiveParams.baseFontSize, color: DARK_TEXT_COLOR } }, color: DARK_TEXT_COLOR, gridcolor: DARK_BORDER_COLOR, zeroline: true, zerolinecolor: DARK_MUTED_COLOR, tickfont: { size: responsiveParams.baseFontSize - 1, color: DARK_TEXT_COLOR } }, plot_bgcolor: DARK_CARD_COLOR, paper_bgcolor: DARK_BACKGROUND_COLOR, font: { color: DARK_TEXT_COLOR, size: responsiveParams.baseFontSize }, showlegend: true, legend: {...responsiveParams.legend, orientation:'h', yanchor:'bottom', y:1.02, xanchor:'right', x:1}, margin: responsiveParams.margin, hovermode: 'closest' };
    return { plotData, layout };
}


// --- Export ---
function downloadBlob(blob, filename) { const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = filename; document.body.appendChild(link); link.click(); document.body.removeChild(link); URL.revokeObjectURL(link.href); }
function exportResultsToTxtFile() { /* ... from previous script, ensure all new results are included ... */
    if (!calculatedResults || typeof calculatedResults.n !== 'number') { Swal.fire(_t('warning_title'), _t('status_no_results'), 'warning'); return; }
    updateStatus('status_saving_results', {}, 'info'); const lines = []; const results = calculatedResults; const now = new Date();
    lines.push(`========== ${_t('app_title')} ==========`); lines.push(`${_t('data_count')}: ${formatNumber(results.n, 0)}`); lines.push(`Date: ${now.toLocaleString(currentLang === 'fa' ? 'fa-IR' : 'en-US')}`);
    lines.push(`Risk-Free Rate: ${formatNumber(results.rf, 2, true)}`); lines.push(`Expected Market Return: ${formatNumber(results.expectedMarketReturn, 2, true)}`);
    lines.push("-".repeat(50)); lines.push(_t('results_title')); lines.push("-".repeat(50));
    const resOrder = ['mean','gm','std','dsd','var','cv','mdd','mdd_period','skew','kurt','var5','var95','cvar5','max_gain','sh','so','omega', 'trackingError', 'informationRatio', 'beta','alpha','rSquared','capmExpectedReturn','regStdErr','betaTStat','betaPValue','alphaTStat','alphaPValue'];
    const resLabels = {'mean':'mean_label', 'gm':'geo_mean_label', /*... map all keys to their label keys ...*/ 'capmExpectedReturn':'capm_expected_return_label', 'trackingError':'tracking_error_label', 'informationRatio':'information_ratio_label'}; // Add all mappings
    resOrder.forEach(key => { if(results.hasOwnProperty(key)) lines.push(`${_t(resLabels[key] || key + '_label')}: ${formatNumber(results[key], (key==='var'||key==='rSquared'||key==='beta'||key==='alpha'||key==='cv'||key==='skew'||key==='kurt'||key==='sh'||key==='so'||key==='omega'||key==='informationRatio'||key==='regStdErr'||key==='betaTStat'||key==='alphaTStat'||key==='betaPValue'||key==='alphaPValue'?3:2), (key.includes('Return')||key==='mean'||key==='gm'||key==='std'||key==='dsd'||key==='mdd'||key==='var5'||key==='var95'||key==='cvar5'||key==='max_gain'||key==='alpha'||key==='trackingError'))}`); });
    lines.push("\n" + "=".repeat(50)); lines.push(`Input Asset Data (${dataPoints.length} points):`); lines.push("-".repeat(50)); lines.push(...dataPoints.map((p, i) => `${formatNumber(i + 1, 0)}. ${formatNumber(p, 4)}%`));
    if(marketDataPoints.length > 0) { lines.push("\nMarket Data:"); lines.push(...marketDataPoints.map((p, i) => `${formatNumber(i + 1, 0)}. ${formatNumber(p, 4)}%`));}
    if(benchmarkDataPoints.length > 0) { lines.push("\nBenchmark Data:"); lines.push(...benchmarkDataPoints.map((p, i) => `${formatNumber(i + 1, 0)}. ${formatNumber(p, 4)}%`));}
    lines.push("=".repeat(50));
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' }); downloadBlob(blob, `RiskAnalysisResults_${new Date().toISOString().slice(0,10)}.txt`);
    updateStatus('status_saving_txt_success', { filename: `RiskAnalysisResults_${new Date().toISOString().slice(0,10)}.txt` }, 'success');
}
function exportResultsToExcelFile() { /* ... from previous script, ensure all new results are included ... */
    if (!calculatedResults || typeof calculatedResults.n !== 'number') { Swal.fire(_t('warning_title'), _t('status_no_results'), 'warning'); return; }
    updateStatus('status_saving_results', {}, 'info'); const results = calculatedResults; const now = new Date();
    const rawDataSheetData = [[_t('col_return')]]; dataPoints.forEach(p => rawDataSheetData.push([p]));
    const resultsSheetData = []; resultsSheetData.push([_t('app_title')]); resultsSheetData.push([`${_t('data_count')}:`, results.n]); /* ... add all results similar to TXT export ... */
    const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(rawDataSheetData), _t('excel_sheet_raw_data_title')); XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(resultsSheetData), _t('excel_sheet_results_title'));
    const filename = `RiskAnalysisResults_${now.toISOString().slice(0,10)}.xlsx`; XLSX.writeFile(wb, filename);
    updateStatus('status_saving_excel_success', { filename }, 'success');
}

// --- Tooltip & Modal Handlers ---
function initializeSweetAlertTooltips() { document.body.addEventListener('click', (event) => { const icon = event.target.closest('.tooltip-icon'); if (!icon) return; event.preventDefault(); const tooltipKey = icon.getAttribute('data-tooltip-key'); if (!tooltipKey) return; const tooltipText = _t(tooltipKey); if (!tooltipText || tooltipText === tooltipKey) return; Swal.fire({ title: `<strong class="text-lg font-semibold">${_t(tooltipKey.replace('_tooltip','_label') || _t('info_title'))}</strong>`, html: `<div class="text-sm text-left rtl:text-right leading-relaxed">${tooltipText.replace(/\n/g, '<br>')}</div>`, icon: 'info', confirmButtonText: _t('ok_button'), customClass: { popup: 'swal2-popup', title: 'swal2-title', htmlContainer: 'swal2-html-container', confirmButton: 'swal2-confirm', closeButton: 'swal2-close' }, showCloseButton: true }); });}
function closeModal() { if (plotModal) { plotModal.classList.add('hidden'); plotModal.classList.remove('flex'); } document.body.style.overflow = 'auto'; if (plotContainer) Plotly.purge(plotContainer); window.removeEventListener('keydown', escapeKeyHandler); if(plotModal) plotModal.removeEventListener('click', backdropClickHandler); }
function closeModalHandler() { closeModal(); }
function backdropClickHandler(event) { if (event.target === plotModal) closeModal(); }
function escapeKeyHandler(event) { if (event.key === 'Escape') closeModal(); }


// --- Event Listeners & Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    // Language
    const savedLang = localStorage.getItem('preferredLang');
    if (savedLang && langSelect) langSelect.value = savedLang;
    currentLang = langSelect ? langSelect.value : 'fa';
    updateLanguageUI();
    if (langSelect) langSelect.addEventListener('change', () => { localStorage.setItem('preferredLang', langSelect.value); updateLanguageUI(); });

    // Asset Data
    if (addButton) addButton.addEventListener('click', addAssetDataPoint);
    if (valueEntry) valueEntry.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addAssetDataPoint(); } });
    if (editSelect) editSelect.addEventListener('change', loadValueForEditFromMenu);
    if (saveEditButton) saveEditButton.addEventListener('click', saveEditedValue);
    if (editValueEntry) editValueEntry.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); saveEditedValue(); } });
    if (deleteButton) deleteButton.addEventListener('click', deleteSelectedData);
    if (clearListButton) clearListButton.addEventListener('click', clearAssetDataList);
    setupDragAndDrop(dedicatedFileDropAreaAsset, fileImporterInputAsset, dataPoints, 'data_list_title', 'add_data_title', updateDataDisplay);

    // Market Data
    if (addMarketDataButton) addMarketDataButton.addEventListener('click', addMarketDataPoint);
    if (marketValueEntry) marketValueEntry.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addMarketDataPoint(); } });
    if (clearMarketDataButton) clearMarketDataButton.addEventListener('click', clearMarketDataPoints);

    // Benchmark Data
    if (addBenchmarkDataButton) addBenchmarkDataButton.addEventListener('click', addBenchmarkDataPoint);
    if (benchmarkValueEntry) benchmarkValueEntry.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addBenchmarkDataPoint(); } });
    if (clearBenchmarkDataButton) clearBenchmarkDataButton.addEventListener('click', clearBenchmarkDataPoints);

    // Calculate
    if (calculateButton) calculateButton.addEventListener('click', calculateMetrics);

    // Plot Buttons
    const plotButtonConfigs = [
        { el: plotHistButton, func: plotHistogramLogic, title: 'plot_hist_title' },
        { el: plotBoxButton, func: plotBoxplotLogic, title: 'plot_box_title' },
        { el: plotEquityButton, func: plotEquityCurveLogic, title: 'plot_equity_title' },
        { el: plotQqButton, func: plotQqplotLogic, title: 'plot_qq_title' },
        { el: plotRegressionButton, func: plotRegressionLogic, title: 'plot_regression_title' }
    ];
    plotButtonConfigs.forEach(cfg => {
        if (cfg.el) cfg.el.addEventListener('click', () => plotActionWrapper(cfg.func, cfg.title));
    });

    // Export
    if (exportResultsButton) exportResultsButton.addEventListener('click', async () => {
        if (!calculatedResults || typeof calculatedResults.n !== 'number') { Swal.fire(_t('warning_title'), _t('status_no_results'), 'warning'); return; }
        const { value: format } = await Swal.fire({ title: _t('export_format_title'), input: 'select', inputOptions: { 'txt': _t('export_txt'), 'excel': _t('export_excel')}, inputPlaceholder: _t('select_option'), showCancelButton: true, confirmButtonText: _t('ok_button'), cancelButtonText: _t('cancel_button'),customClass: { popup: 'swal2-popup', title: 'swal2-title', input: 'swal2-input', confirmButton: 'swal2-confirm', cancelButton: 'swal2-cancel'} });
        if (format === 'txt') exportResultsToTxtFile();
        else if (format === 'excel') exportResultsToExcelFile();
        else if (format) updateStatus('status_save_cancel', {}, 'info');
    });

    // Modal
    if (plotModalCloseButton) plotModalCloseButton.addEventListener('click', closeModalHandler);
    if (plotModal) {
        plotModal.addEventListener('click', backdropClickHandler); // For clicking outside
        // Ensure escape key listener is added when modal is shown, removed when hidden
        // This is now handled inside plotActionWrapper and closeModal
    }

    // Initial UI State
    updateEditControlsState();
    updateActionButtonsState();
    resetResultsDisplay(); // Important to show N/A initially
    updateDataDisplay(); // Show "List Empty" for asset data
    updateMarketDataDisplay(); // Show "List Empty" for market data
    updateBenchmarkDataDisplay(); // Show "List Empty" for benchmark data
    initializeSweetAlertTooltips();
    updateStatus('status_ready');
    console.log("Application initialized.");
});

// Add missing item prefix keys for generic display
texts['market_data_item_prefix'] = { 'en': 'Market {index}:', 'fa': 'بازار {index}:' };
texts['benchmark_data_item_prefix'] = { 'en': 'Benchmark {index}:', 'fa': 'معیار {index}:' };

