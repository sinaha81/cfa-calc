// Global variables and constants
let currentLang = 'fa';
let dataPoints = []; // Array to hold numerical data points for the asset
let marketDataPoints = []; // Array to hold market return data points
let benchmarkDataPoints = []; // Array to hold benchmark return data points
let calculatedResults = {}; // Asset analysis results
let selectedEditIndex = -1;
let equityCalculatedResults = {}; // New: Store equity valuation results
let fixedIncomeCalculatedResults = {}; // New: Store fixed income results
let portfolioCalculatedResults = {}; // New: Store portfolio results
let portfolioAssets = []; // Array to store portfolio assets {id, return, stdDev, weight, correlations: {id: correlation}}
let nextAssetId = 1; // For unique IDs for portfolio assets

// --- Translations Dictionary ---
const texts = {
    'app_title': {
        'en': 'Advanced Risk and Return Analyzer',
        'fa': 'تحلیلگر پیشرفته ریسک و بازده'
    },
    'results_title': {
        'en': 'Analysis Results',
        'fa': 'نتایج تحلیل'
    },
    'advanced_metrics_title': {
        'en': 'Advanced CFA Metrics',
        'fa': 'معیارهای پیشرفته CFA'
    },

    'mean_label': {
        'en': 'Mean Return',
        'fa': 'میانگین بازده'
    },
    'geo_mean_label': {
        'en': 'Geometric Mean',
        'fa': 'میانگین هندسی'
    },
    'std_dev_label': {
        'en': 'Standard Deviation',
        'fa': 'انحراف معیار'
    },
    'downside_dev_label': {
        'en': 'Downside Deviation',
        'fa': 'انحراف نزولی'
    },
    'variance_label': {
        'en': 'Variance',
        'fa': 'واریانس'
    },
    'cv_label': {
        'en': 'Coefficient of Variation',
        'fa': 'ضریب تغییرات'
    },
    'mdd_label': {
        'en': 'Maximum Drawdown',
        'fa': 'حداکثر افت'
    },
    'skewness_label': {
        'en': 'Skewness',
        'fa': 'چولگی'
    },
    'kurtosis_label': {
        'en': 'Kurtosis',
        'fa': 'کشیدگی'
    },

    'var_label': {
        'en': 'Value at Risk (5%)',
        'fa': 'ارزش در معرض ریسک (۵٪)'
    },
    'var_95_label': {
        'en': 'Value at Risk (95%)',
        'fa': 'ارزش در معرض ریسک (۹۵٪)'
    },
    'cvar_label': {
        'en': 'Conditional VaR (5%)',
        'fa': 'ارزش در معرض ریسک شرطی (۵٪)'
    },
    'max_gain_label': {
        'en': 'Maximum Gain',
        'fa': 'حداکثر سود'
    },

    'sharpe_label': {
        'en': 'Sharpe Ratio',
        'fa': 'نسبت شارپ'
    },
    'sortino_label': {
        'en': 'Sortino Ratio',
        'fa': 'نسبت سورتینو'
    },
    'omega_label': {
        'en': 'Omega Ratio',
        'fa': 'نسبت اومگا'
    },

    'treynor_ratio_label': {
        'en': 'Treynor Ratio',
        'fa': 'نسبت ترینور'
    },
    'calmar_ratio_label': {
        'en': 'Calmar Ratio',
        'fa': 'نسبت کالمر'
    },
    'jensen_alpha_label': {
        'en': 'Jensen\'s Alpha',
        'fa': 'آلفای جنسن'
    },
    'm2_measure_label': {
        'en': 'M2 Measure',
        'fa': 'معیار M2'
    },
    'beta_label': {
        'en': 'Beta',
        'fa': 'بتا'
    },
    'alpha_label': {
        'en': 'Alpha',
        'fa': 'آلفا'
    },
    'rsquared_label': {
        'en': 'R-Squared',
        'fa': 'ضریب تعیین'
    },
    'capm_expected_return_label': {
        'en': 'CAPM Expected Return',
        'fa': 'بازده مورد انتظار CAPM'
    },
    'reg_stderr_label': {
        'en': 'Regression Standard Error',
        'fa': 'خطای استاندارد رگرسیون'
    },
    'beta_t_stat_label': {
        'en': 'Beta T-Statistic',
        'fa': 'آماره t بتا'
    },
    'beta_p_value_label': {
        'en': 'Beta P-Value',
        'fa': 'مقدار P بتا'
    },
    'alpha_p_value_label': {
        'en': 'Alpha P-Value',
        'fa': 'مقدار P آلفا'
    },

    'tracking_error_label': {
        'en': 'Tracking Error',
        'fa': 'خطای ردیابی'
    },
    'information_ratio_label': {
        'en': 'Information Ratio',
        'fa': 'نسبت اطلاعاتی'
    },

    'mean_tooltip': {
        'en': 'Average return of the investment',
        'fa': 'میانگین بازده سرمایه‌گذاری'
    },
    'geo_mean_tooltip': {
        'en': 'Geometric mean return, accounting for compounding effects',
        'fa': 'میانگین هندسی بازده، با در نظر گرفتن اثرات مرکب'
    },
    'std_dev_tooltip': {
        'en': 'Standard deviation of returns, measuring total risk',
        'fa': 'انحراف معیار بازده‌ها، اندازه‌گیری ریسک کل'
    },
    'downside_dev_tooltip': {
        'en': 'Standard deviation of negative returns only',
        'fa': 'انحراف معیار بازده‌های منفی'
    },
    'var_tooltip': {
        'en': 'Value at Risk at 5% confidence level',
        'fa': 'ارزش در معرض ریسک در سطح اطمینان ۵٪'
    },
    'cvar_tooltip': {
        'en': 'Conditional Value at Risk, expected loss beyond VaR',
        'fa': 'ارزش در معرض ریسک شرطی، زیان مورد انتظار فراتر از VaR'
    },
    'sharpe_tooltip': {
        'en': 'Risk-adjusted return measure using total risk',
        'fa': 'معیار بازده تعدیل شده با ریسک با استفاده از ریسک کل'
    },
    'sortino_tooltip': {
        'en': 'Risk-adjusted return measure using downside risk',
        'fa': 'معیار بازده تعدیل شده با ریسک با استفاده از ریسک نزولی'
    },
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

    // Tab Names
    'tab_asset_analysis': {'en': "Asset Analysis", 'fa': "تحلیل دارایی"},
    'tab_equity_valuation': {'en': "Equity Valuation", 'fa': "ارزش‌گذاری سهام"},
    'tab_fixed_income': {'en': "Fixed Income", 'fa': "اوراق قرضه"},
    'tab_portfolio_management': {'en': "Portfolio Management", 'fa': "مدیریت پورتفولیو"},

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

    // Equity Valuation
    'equity_valuation_title': {'en': "Equity Valuation", 'fa': "ارزش‌گذاری سهام"},
    'equity_valuation_hint': {'en': "Calculations related to equity valuation and fundamental analysis.", 'fa': "محاسبات مربوط به ارزش‌گذاری سهام و تحلیل بنیادی."},
    'current_dividend_label': {'en': "Current Dividend (D0):", 'fa': "سود نقدی فعلی (D0):"},
    'current_dividend_tooltip': {'en': "The most recently paid dividend per share.", 'fa': "آخرین سود نقدی پرداخت شده به ازای هر سهم."},
    'dividend_growth_rate_label': {'en': "Dividend Growth Rate (g) %:", 'fa': "نرخ رشد سود نقدی (g) %:"},
    'dividend_growth_rate_tooltip': {'en': "Expected constant growth rate of dividends.", 'fa': "نرخ رشد ثابت مورد انتظار سود نقدی."},
    'required_return_equity_label': {'en': "Required Rate of Return (r) %:", 'fa': "نرخ بازده مورد نیاز (r) %:"},
    'required_return_equity_tooltip': {'en': "The minimum rate of return an investor expects to receive.", 'fa': "حداقل نرخ بازدهی که یک سرمایه‌گذار انتظار دارد دریافت کند."},
    'earnings_per_share_label': {'en': "Earnings Per Share (EPS):", 'fa': "سود هر سهم (EPS):"},
    'earnings_per_share_tooltip': {'en': "A company's profit allocated to each outstanding share of common stock.", 'fa': "سود شرکت تخصیص یافته به هر سهم عادی در گردش."},
    'current_share_price_label': {'en': "Current Share Price:", 'fa': "قیمت فعلی سهم:"},
    'current_share_price_tooltip': {'en': "The current market price of one share of the company's stock.", 'fa': "قیمت فعلی بازار یک سهم از سهام شرکت."},
    'calculate_equity_button': {'en': "Calculate Equity Valuation", 'fa': "محاسبه ارزش‌گذاری سهام"},
    'equity_results_title': {'en': "Equity Valuation Results", 'fa': "نتایج ارزش‌گذاری سهام"},
    'ddm_value_label': {'en': "DDM Value (P0):", 'fa': "ارزش مدل DDM (P0):"},
    'ddm_value_tooltip': {'en': "Value per share using the Dividend Discount Model (D0 * (1+g) / (r-g)).", 'fa': "ارزش هر سهم با استفاده از مدل تنزیل سود نقدی (D0 * (1+g) / (r-g))."},
    'ggm_value_label': {'en': "GGM Value (P0):", 'fa': "ارزش مدل GGM (P0):"},
    'ggm_value_tooltip': {'en': "Value per share using the Gordon Growth Model (D1 / (r-g)). Assumes constant growth.", 'fa': "ارزش هر سهم با استفاده از مدل رشد گوردون (D1 / (r-g)). فرض بر رشد ثابت است."},
    'pe_ratio_label': {'en': "P/E Ratio:", 'fa': "نسبت P/E:"},
    'pe_ratio_tooltip': {'en': "Price-to-Earnings Ratio (Current Share Price / EPS).", 'fa': "نسبت قیمت به سود (قیمت فعلی سهم / EPS)."},
    'equity_input_error': {'en': "Please enter valid numeric values for all equity valuation inputs.", 'fa': "لطفاً مقادیر عددی معتبر برای تمام ورودی‌های ارزش‌گذاری سهام وارد کنید."},
    'ddm_ggm_error': {'en': "Required return (r) must be greater than dividend growth rate (g) for DDM/GGM.", 'fa': "نرخ بازده مورد نیاز (r) باید بزرگتر از نرخ رشد سود نقدی (g) برای DDM/GGM باشد."},
    'eps_price_error': {'en': "EPS and Current Share Price must be positive for P/E Ratio.", 'fa': "EPS و قیمت فعلی سهم برای نسبت P/E باید مثبت باشند."},

    // Fixed Income
    'fixed_income_title': {'en': "Fixed Income & Bonds", 'fa': "اوراق قرضه و درآمد ثابت"},
    'fixed_income_hint': {'en': "Calculations related to bonds, including yield to maturity, duration, and valuation.", 'fa': "محاسبات مربوط به اوراق قرضه، شامل بازده تا سررسید، مدت زمان و ارزش‌گذاری."},
    'face_value_label': {'en': "Face Value:", 'fa': "ارزش اسمی (Face Value):"},
    'face_value_tooltip': {'en': "The nominal value or par value of the bond, paid at maturity.", 'fa': "ارزش اسمی یا ارزش اسمی اوراق قرضه که در سررسید پرداخت می‌شود."},
    'coupon_rate_label': {'en': "Coupon Rate (% Annually):", 'fa': "نرخ کوپن (% سالانه):"},
    'coupon_rate_tooltip': {'en': "The annual interest rate paid on the bond's face value.", 'fa': "نرخ بهره سالانه پرداخت شده بر اساس ارزش اسمی اوراق قرضه."},
    'years_to_maturity_label': {'en': "Years to Maturity:", 'fa': "سال تا سررسید:"},
    'years_to_maturity_tooltip': {'en': "The number of years remaining until the bond matures.", 'fa': "تعداد سال‌های باقی‌مانده تا سررسید اوراق قرضه."},
    'market_price_bond_label': {'en': "Current Market Price:", 'fa': "قیمت بازار فعلی:"},
    'market_price_bond_tooltip': {'en': "The current price at which the bond is trading in the market.", 'fa': "قیمت فعلی که اوراق قرضه در بازار معامله می‌شود."},
    'ytm_input_label': {'en': "Yield to Maturity (YTM) %:", 'fa': "بازده تا سررسید (YTM) %:"},
    'ytm_input_tooltip': {'en': "The total return an investor can expect to receive if they hold the bond until maturity.", 'fa': "کل بازدهی که یک سرمایه‌گذار می‌تواند انتظار داشته باشد در صورت نگهداری اوراق قرضه تا سررسید دریافت کند."},
    'coupon_frequency_label': {'en': "Coupon Frequency:", 'fa': "دفعات پرداخت کوپن:"},
    'coupon_frequency_tooltip': {'en': "How many times per year the coupon is paid.", 'fa': "تعداد دفعات پرداخت کوپن در سال."},
    'annual': {'en': "Annual", 'fa': "سالانه"},
    'semi_annual': {'en': "Semi-Annual", 'fa': "نیمه سالانه"},
    'quarterly': {'en': "Quarterly", 'fa': "فصلی"},
    'monthly': {'en': "Monthly", 'fa': "ماهانه"},
    'calculate_bond_button': {'en': "Calculate Bond Metrics", 'fa': "محاسبه اوراق قرضه"},
    'fixed_income_results_title': {'en': "Fixed Income Results", 'fa': "نتایج اوراق قرضه"},
    'bond_price_label': {'en': "Bond Price:", 'fa': "قیمت اوراق قرضه:"},
    'bond_price_tooltip': {'en': "The calculated present value of the bond's future cash flows.", 'fa': "ارزش فعلی محاسبه شده جریان‌های نقدی آتی اوراق قرضه."},
    'ytm_label': {'en': "Yield to Maturity (YTM):", 'fa': "بازده تا سررسید (YTM):"},
    'ytm_tooltip': {'en': "The calculated yield to maturity of the bond.", 'fa': "بازده تا سررسید محاسبه شده اوراق قرضه."},
    'macaulay_duration_label': {'en': "Macaulay Duration:", 'fa': "مدت زمان مکالی:"},
    'macaulay_duration_tooltip': {'en': "The weighted average time until a bond's cash flows are received.", 'fa': "میانگین وزنی زمان تا دریافت جریان‌های نقدی اوراق قرضه."},
    'modified_duration_label': {'en': "Modified Duration:", 'fa': "مدت زمان تعدیل شده:"},
    'modified_duration_tooltip': {'en': "Measures the percentage change in a bond's price for a 1% change in yield.", 'fa': "تغییر درصدی قیمت اوراق قرضه به ازای ۱٪ تغییر در بازده را اندازه‌گیری می‌کند."},
    'convexity_label': {'en': "Convexity:", 'fa': "کانوکسیتی:"},
    'convexity_tooltip': {'en': "Measures the curvature of a bond's price-yield relationship.", 'fa': "انحنای رابطه قیمت-بازده اوراق قرضه را اندازه‌گیری می‌کند."},
    'plot_bond_price_yield_button': {'en': "Plot Bond Price-Yield Curve", 'fa': "نمودار قیمت-بازده اوراق قرضه"},
    'bond_input_error': {'en': "Please enter valid numeric values for all bond inputs.", 'fa': "لطفاً مقادیر عددی معتبر برای تمام ورودی‌های اوراق قرضه وارد کنید."},
    'bond_price_yield_plot_title': {'en': "Bond Price-Yield Relationship", 'fa': "رابطه قیمت-بازده اوراق قرضه"},
    'plot_axis_yield': {'en': "Yield to Maturity (%)", 'fa': "بازده تا سررسید (%)"},
    'plot_axis_bond_price': {'en': "Bond Price", 'fa': "قیمت اوراق قرضه"},

    // Portfolio Management
    'portfolio_management_title': {'en': "Portfolio Management", 'fa': "مدیریت پورتفولیو"},
    'portfolio_management_hint': {'en': "Calculations related to portfolio returns, risk, and correlation.", 'fa': "محاسبات مربوط به پورتفولیو، شامل بازده، ریسک و همبستگی."},
    'add_portfolio_asset_button': {'en': "Add Asset to Portfolio", 'fa': "افزودن دارایی به پورتفولیو"},
    'portfolio_asset_name_label': {'en': "Asset Name:", 'fa': "نام دارایی:"},
    'portfolio_asset_return_label': {'en': "Expected Return (%):", 'fa': "بازده مورد انتظار (%):"},
    'portfolio_asset_stddev_label': {'en': "Standard Deviation (%):", 'fa': "انحراف معیار (%):"},
    'portfolio_asset_weight_label': {'en': "Weight (%):", 'fa': "وزن (%):"},
    'portfolio_asset_correlation_label': {'en': "Correlation with Asset {id} (ρ):", 'fa': "همبستگی با دارایی {id} (ρ):"},
    'remove_asset_button': {'en': "Remove", 'fa': "حذف"},
    'calculate_portfolio_button': {'en': "Calculate Portfolio Metrics", 'fa': "محاسبه پورتفولیو"},
    'portfolio_results_title': {'en': "Portfolio Results", 'fa': "نتایج پورتفولیو"},
    'portfolio_expected_return_label': {'en': "Portfolio Expected Return:", 'fa': "بازده مورد انتظار پورتفولیو:"},
    'portfolio_expected_return_tooltip': {'en': "The weighted average of the expected returns of the individual assets in the portfolio.", 'fa': "میانگین وزنی بازده‌های مورد انتظار دارایی‌های منفرد در پورتفولیو."},
    'portfolio_stddev_label': {'en': "Portfolio Standard Deviation:", 'fa': "انحراف معیار پورتفولیو:"},
    'portfolio_stddev_tooltip': {'en': "Measures the total risk of the portfolio, considering asset volatilities and their correlation.", 'fa': "ریسک کل پورتفولیو را با در نظر گرفتن نوسانات دارایی‌ها و همبستگی آن‌ها اندازه‌گیری می‌کند."},
    'portfolio_variance_label': {'en': "Portfolio Variance:", 'fa': "واریانس پورتفولیو:"},
    'portfolio_variance_tooltip': {'en': "The total variance of the portfolio, considering asset volatilities and their correlations.", 'fa': "واریانس کل پورتفولیو، با در نظر گرفتن نوسانات دارایی‌ها و همبستگی‌های آن‌ها."},
    'portfolio_variance_label': {'en': "Portfolio Variance:", 'fa': "واریانس پورتفولیو:"},
    'portfolio_variance_tooltip': {'en': "The total variance of the portfolio, considering asset volatilities and their correlations.", 'fa': "واریانس کل پورتفولیو، با در نظر گرفتن نوسانات دارایی‌ها و همبستگی‌های آن‌ها."},
    'covariance_label': {'en': "Covariance (Pairwise):", 'fa': "کوواریانس (جفتی):"}, // Keep for potential future use or if needed elsewhere
    'covariance_tooltip': {'en': "Measures the directional relationship between the returns of two assets.", 'fa': "رابطه جهت‌دار بین بازده دو دارایی را اندازه‌گیری می‌کند."}, // Keep for potential future use or if needed elsewhere
    'portfolio_input_error': {'en': "Please enter valid numeric values for all portfolio inputs.", 'fa': "لطفاً مقادیر عددی معتبر برای تمام ورودی‌های پورتفولیو وارد کنید."},
    'portfolio_weights_error': {'en': "Asset weights must sum to 100%.", 'fa': "مجموع وزن‌های دارایی باید ۱۰۰٪ باشد."},
    'correlation_range_error': {'en': "Correlation must be between -1 and 1.", 'fa': "همبستگی باید بین -۱ و ۱ باشد."},
    'portfolio_min_assets_error': {'en': "Please add at least two assets to calculate portfolio metrics.", 'fa': "لطفاً حداقل دو دارایی برای محاسبه معیارهای پورتفولیو اضافه کنید."},
    'portfolio_asset_removed': {'en': "Asset '{name}' removed from portfolio.", 'fa': "دارایی '{name}' از پورتفولیو حذف شد."},
    'portfolio_asset_added': {'en': "Asset '{name}' added to portfolio.", 'fa': "دارایی '{name}' به پورتفولیو اضافه شد."},
    'portfolio_asset_updated': {'en': "Asset '{name}' updated.", 'fa': "دارایی '{name}' به‌روزرسانی شد."},
    'portfolio_asset_default_name': {'en': "Asset {id}", 'fa': "دارایی {id}"},
    'portfolio_asset_name_placeholder': {'en': "e.g., Stock A", 'fa': "مثلا سهام الف"},
    'portfolio_asset_return_placeholder': {'en': "e.g., 10", 'fa': "مثلا ۱۰"},
    'portfolio_asset_stddev_placeholder': {'en': "e.g., 15", 'fa': "مثلا ۱۵"},
    'portfolio_asset_weight_placeholder': {'en': "e.g., 50", 'fa': "مثلا ۵۰"},
    'portfolio_asset_correlation_placeholder': {'en': "e.g., 0.5", 'fa': "مثلا ۰.۵"},
    'portfolio_rf_rate_label': {'en': "Risk-Free Rate (% Annually):", 'fa': "نرخ بازده بدون ریسک (% سالانه):"},


};

// --- DOM Element Selectors ---
// Tab Navigation
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

// Asset Data
const valueEntry = document.getElementById('value-entry');
const addButton = document.getElementById('add-button');
const editSelect = document.getElementById('edit-select');
const editValueEntry = document.getElementById('edit-value-entry');
const saveEditButton = document.getElementById('save-edit-button');
const deleteButton = document.getElementById('delete-button');
const dataDisplay = document.getElementById('data-display');
const clearListButton = document.getElementById('clear-list-button');
const dedicatedFileDropAreaAsset = document.getElementById('dedicated-file-drop-area');
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

// Equity Valuation
const currentDividendInput = document.getElementById('current-dividend');
const dividendGrowthRateInput = document.getElementById('dividend-growth-rate');
const requiredReturnEquityInput = document.getElementById('required-return-equity');
const earningsPerShareInput = document.getElementById('earnings-per-share');
const currentSharePriceInput = document.getElementById('current-share-price');
const calculateEquityButton = document.getElementById('calculate-equity-button');
const equityResultsDisplay = document.getElementById('equity-results-display');

// Fixed Income
const faceValueInput = document.getElementById('face-value');
const couponRateInput = document.getElementById('coupon-rate');
const yearsToMaturityInput = document.getElementById('years-to-maturity');
const marketPriceBondInput = document.getElementById('market-price-bond');
const ytmInputBond = document.getElementById('ytm-input');
const couponFrequencySelect = document.getElementById('coupon-frequency');
const calculateBondButton = document.getElementById('calculate-bond-button');
const fixedIncomeResultsDisplay = document.getElementById('fixed-income-results-display');
const plotBondPriceYieldButton = document.getElementById('plot-bond-price-yield-button');

// Portfolio Management
const portfolioAssetsContainer = document.getElementById('portfolio-assets-container');
const addPortfolioAssetButton = document.getElementById('add-portfolio-asset-button');
const portfolioRfRateInput = document.getElementById('portfolio-rf-rate');
const calculatePortfolioButton = document.getElementById('calculate-portfolio-button');
const portfolioResultsDisplay = document.getElementById('portfolio-results-display');


// General & Controls
const langSelect = document.getElementById('lang-select');
const rfRateInput = document.getElementById('rf-rate'); // This is for Asset Analysis tab
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
    const currentLang = document.documentElement.lang;
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (texts[key] && texts[key][currentLang]) {
            element.textContent = texts[key][currentLang];
        }
    });

    // به‌روزرسانی placeholder‌ها
    document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        if (texts[key] && texts[key][currentLang]) {
            element.placeholder = texts[key][currentLang];
        }
    });

    // به‌روزرسانی tooltip‌ها
    document.querySelectorAll('[data-tooltip-key]').forEach(element => {
        const key = element.getAttribute('data-tooltip-key');
        if (texts[key] && texts[key][currentLang]) {
            element.title = texts[key][currentLang];
        }
    });

    // به‌روزرسانی جهت متن
    document.documentElement.dir = currentLang === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;

    // به‌روزرسانی کلاس‌های RTL/LTR
    document.body.classList.toggle('rtl', currentLang === 'fa');
    document.body.classList.toggle('ltr', currentLang === 'en');

    // به‌روزرسانی فونت
    document.body.style.fontFamily = currentLang === 'fa' ? 'Vazirmatn, sans-serif' : 'sans-serif';
}

// اضافه کردن event listener برای تغییر زبان
document.getElementById('lang-select').addEventListener('change', function(e) {
    document.documentElement.lang = e.target.value;
    updateLanguageUI();
});

// فراخوانی اولیه برای تنظیم زبان پیش‌فرض
updateLanguageUI();

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
function calculateMaxDrawdown(returnsPerc) {
    if (!returnsPerc || returnsPerc.length === 0) return { maxDrawdown: 0.0, duration: 0, peakIndex: 0, troughIndex: 0 };
    const dataArr = returnsPerc.filter(p => isFinite(p));
    if (dataArr.length === 0) return { maxDrawdown: 0.0, duration: 0, peakIndex: 0, troughIndex: 0 };

    let cumulative = [1.0];
    dataArr.forEach(r => {
        cumulative.push(cumulative[cumulative.length - 1] * (1 + r / 100.0));
    });

    let maxDd = 0.0;
    let peakIndexOriginal = 0;
    let troughIndexOriginal = 0;
    let currentPeakValue = cumulative[0];
    let currentPeakIndexCumulative = 0;

    for (let i = 1; i < cumulative.length; i++) {
        if (cumulative[i] > currentPeakValue) {
            currentPeakValue = cumulative[i];
            currentPeakIndexCumulative = i;
        } else {
            // Handle division by zero if currentPeakValue is 0
            const currentDrawdown = (currentPeakValue === 0) ? -100.0 : (cumulative[i] / currentPeakValue - 1.0) * 100.0;
            if (currentDrawdown < maxDd) {
                maxDd = currentDrawdown;
                peakIndexOriginal = currentPeakIndexCumulative;
                troughIndexOriginal = i;
            }
        }
    }
    // Duration is from peak to trough (inclusive of trough, exclusive of peak)
    // troughIndexOriginal is the index in the cumulative array.
    // If data points are 0-indexed, and cumulative has an initial 1.0 at index 0,
    // then the actual data point index for trough is troughIndexOriginal - 1.
    // The duration is simply the difference in indices in the cumulative array.
    const duration = troughIndexOriginal - peakIndexOriginal;

    return {
        maxDrawdown: isFinite(maxDd) ? maxDd : 0.0,
        duration: isFinite(duration) ? duration : 0,
        peakIndex: peakIndexOriginal, // Index in cumulative array
        troughIndex: troughIndexOriginal // Index in cumulative array
    };
}

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

        if (n <= 2) { // Not enough data for significance tests (df = n-2)
            return { beta, alpha, rSquared, stdErrRegression: NaN, tStatBeta: NaN, pValBeta: NaN, tStatAlpha: NaN, pValAlpha: NaN };
        }
        const residuals = assetReturns.map((y, i) => y - lineFunc(marketReturns[i]));
        const sumSqResiduals = residuals.reduce((sum, r) => sum + r * r, 0);
        const stdErrRegression = Math.sqrt(sumSqResiduals / (n - 2));

        const meanMarket = ss.mean(marketReturns);
        const sumSqDevMarket = marketReturns.reduce((sum, x) => sum + Math.pow(x - meanMarket, 2), 0);

        if (sumSqDevMarket < 1e-9) { // Avoid division by zero if market returns are constant
            return { beta, alpha, rSquared, stdErrRegression, tStatBeta: NaN, pValBeta: NaN, tStatAlpha: NaN, pValAlpha: NaN };
        }
        const stdErrBeta = stdErrRegression / Math.sqrt(sumSqDevMarket);
        const tStatBeta = beta / stdErrBeta;
        const stdErrAlpha = stdErrRegression * Math.sqrt((1/n) + (Math.pow(meanMarket, 2) / sumSqDevMarket));
        const tStatAlpha = alpha / stdErrAlpha;

        // P-values require a t-distribution CDF. Simple-statistics doesn't provide this directly.
        // For a more complete solution, a dedicated statistics library (e.g., jStat, numeric.js) would be needed.
        // Keeping them as NaN for now, as per original code.
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

// --- Equity Valuation Calculations ---
function calculateDDM(D0, g, r) {
    // D0: Current Dividend, g: Growth Rate (%), r: Required Return (%), all as percentages
    // Convert g and r to decimals
    const g_dec = g / 100;
    const r_dec = r / 100;

    if (r_dec <= g_dec) {
        return NaN; // Required return must be greater than growth rate
    }
    if (D0 < 0) return NaN; // Dividend cannot be negative for this model
    return D0 * (1 + g_dec) / (r_dec - g_dec);
}

function calculateGGM(D1, r, g) {
    // D1: Next Expected Dividend, r: Required Return (%), g: Growth Rate (%), all as percentages
    // Convert r and g to decimals
    const r_dec = r / 100;
    const g_dec = g / 100;

    if (r_dec <= g_dec) {
        return NaN; // Required return must be greater than growth rate
    }
    if (D1 < 0) return NaN; // Dividend cannot be negative for this model
    return D1 / (r_dec - g_dec);
}

function calculatePERatio(currentSharePrice, EPS) {
    if (EPS <= 0 || currentSharePrice <= 0) {
        return NaN; // EPS must be positive for a meaningful P/E ratio
    }
    return currentSharePrice / EPS;
}

// --- Fixed Income Calculations ---
function calculateBondPrice(faceValue, couponRate, yearsToMaturity, ytm, couponFrequency) {
    // faceValue: bond's face value
    // couponRate: annual coupon rate as percentage
    // yearsToMaturity: years
    // ytm: yield to maturity as percentage
    // couponFrequency: payments per year (1, 2, 4, 12)

    if (faceValue <= 0 || couponRate < 0 || yearsToMaturity <= 0 || ytm < 0 || couponFrequency <= 0) {
        return NaN;
    }

    const couponRate_dec = couponRate / 100;
    const ytm_dec = ytm / 100;
    const numPeriods = yearsToMaturity * couponFrequency;
    const couponPayment = (faceValue * couponRate_dec) / couponFrequency;
    const ratePerPeriod = ytm_dec / couponFrequency;

    let bondPrice = 0;

    // Present value of coupon payments (annuity)
    if (ratePerPeriod === 0) { // Handle zero interest rate
        bondPrice += couponPayment * numPeriods;
    } else {
        bondPrice += couponPayment * (1 - Math.pow(1 + ratePerPeriod, -numPeriods)) / ratePerPeriod;
    }

    // Present value of face value (lump sum)
    bondPrice += faceValue / Math.pow(1 + ratePerPeriod, numPeriods);

    return bondPrice;
}

function calculateYTM(faceValue, couponRate, yearsToMaturity, marketPrice, couponFrequency) {
    // Iterative approach (Newton-Raphson or bisection)
    // This is a simplified bisection method.
    const maxIterations = 1000;
    const tolerance = 0.0001; // 0.01% difference in price

    let lowYTM = 0.0001; // 0.01%
    let highYTM = 1.0; // 100%
    let currentYTM = 0.05; // 5% starting guess

    for (let i = 0; i < maxIterations; i++) {
        const priceAtCurrentYTM = calculateBondPrice(faceValue, couponRate, yearsToMaturity, currentYTM * 100, couponFrequency);
        const diff = priceAtCurrentYTM - marketPrice;

        if (Math.abs(diff) < tolerance) {
            return currentYTM * 100; // Return as percentage
        }

        if (diff > 0) { // Price at current YTM is too high, so YTM must be higher
            lowYTM = currentYTM;
        } else { // Price at current YTM is too low, so YTM must be lower
            highYTM = currentYTM;
        }
        currentYTM = (lowYTM + highYTM) / 2;

        if (lowYTM >= highYTM - 1e-9) { // Prevent infinite loop if bounds converge too slowly
            break;
        }
    }
    return NaN; // Could not converge
}

function calculateMacaulayDuration(faceValue, couponRate, yearsToMaturity, ytm, couponFrequency) {
    if (faceValue <= 0 || couponRate < 0 || yearsToMaturity <= 0 || ytm < 0 || couponFrequency <= 0) {
        return NaN;
    }

    const couponRate_dec = couponRate / 100;
    const ytm_dec = ytm / 100;
    const numPeriods = yearsToMaturity * couponFrequency;
    const couponPayment = (faceValue * couponRate_dec) / couponFrequency;
    const ratePerPeriod = ytm_dec / couponFrequency;

    let sumPVofCF_times_t = 0;
    let bondPrice = 0;

    for (let t = 1; t <= numPeriods; t++) {
        const cashFlow = (t === numPeriods) ? (couponPayment + faceValue) : couponPayment;
        const pv_cf = cashFlow / Math.pow(1 + ratePerPeriod, t);
        sumPVofCF_times_t += pv_cf * t;
        bondPrice += pv_cf; // Summing up PVs to get bond price
    }

    if (bondPrice === 0) return NaN;
    return (sumPVofCF_times_t / bondPrice) / couponFrequency; // Convert back to years
}

function calculateModifiedDuration(macaulayDuration, ytm, couponFrequency) {
    if (isNaN(macaulayDuration) || ytm < 0 || couponFrequency <= 0) return NaN;
    const ytm_dec = ytm / 100;
    return macaulayDuration / (1 + (ytm_dec / couponFrequency));
}

function calculateConvexity(faceValue, couponRate, yearsToMaturity, ytm, couponFrequency) {
    if (faceValue <= 0 || couponRate < 0 || yearsToMaturity <= 0 || ytm < 0 || couponFrequency <= 0) {
        return NaN;
    }

    const couponRate_dec = couponRate / 100;
    const ytm_dec = ytm / 100;
    const numPeriods = yearsToMaturity * couponFrequency;
    const couponPayment = (faceValue * couponRate_dec) / couponFrequency;
    const ratePerPeriod = ytm_dec / couponFrequency;

    let sum_t_tplus1_PVofCF = 0;
    let bondPrice = 0;

    for (let t = 1; t <= numPeriods; t++) {
        const cashFlow = (t === numPeriods) ? (couponPayment + faceValue) : couponPayment;
        const pv_cf = cashFlow / Math.pow(1 + ratePerPeriod, t);
        sum_t_tplus1_PVofCF += pv_cf * t * (t + 1);
        bondPrice += pv_cf;
    }

    if (bondPrice === 0) return NaN;
    return (sum_t_tplus1_PVofCF / (bondPrice * Math.pow(1 + ratePerPeriod, 2))) / Math.pow(couponFrequency, 2);
}

// --- Portfolio Management Calculations ---
// --- Portfolio Management Specific Functions ---

function addPortfolioAsset() {
    const newAsset = {
        id: nextAssetId++,
        name: _t('portfolio_asset_default_name', { id: nextAssetId - 1 }),
        return: NaN,
        stdDev: NaN,
        weight: NaN,
        correlations: {} // Store correlations with other assets by their ID
    };
    portfolioAssets.push(newAsset);
    updatePortfolioAssetUI();
    updateStatus('portfolio_asset_added', { name: newAsset.name }, 'success');
    resetPortfolioResultsDisplay();
}

function removePortfolioAsset(assetId) {
    Swal.fire({
        title: _t('confirm_delete_text'),
        text: _t('portfolio_asset_removed', { name: portfolioAssets.find(a => a.id === assetId)?.name || `ID ${assetId}` }),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: _t('delete_button'),
        cancelButtonText: _t('cancel_button'),
        customClass: { popup: 'swal2-popup', title: 'swal2-title', htmlContainer: 'swal2-html-container', confirmButton: 'swal2-confirm', cancelButton: 'swal2-cancel'}
    }).then((result) => {
        if (result.isConfirmed) {
            const initialLength = portfolioAssets.length;
            portfolioAssets = portfolioAssets.filter(asset => asset.id !== assetId);
            // Also remove correlations involving the deleted asset
            portfolioAssets.forEach(asset => {
                delete asset.correlations[assetId];
            });
            if (portfolioAssets.length < initialLength) {
                updatePortfolioAssetUI();
                resetPortfolioResultsDisplay();
                updateStatus('portfolio_asset_removed', { name: `ID ${assetId}` }, 'success');
            }
        }
    });
}

function updatePortfolioAssetUI() {
    if (!portfolioAssetsContainer) return;
    portfolioAssetsContainer.innerHTML = ''; // Clear existing assets

    portfolioAssets.forEach((asset, index) => {
        const assetDiv = document.createElement('div');
        assetDiv.id = `portfolio-asset-${asset.id}`;
        assetDiv.className = 'bg-dark-card p-4 rounded-lg shadow-md border border-dark-border relative';
        assetDiv.innerHTML = `
            <h3 class="text-lg font-semibold mb-3 text-primary">${_t('portfolio_asset_default_name', { id: index + 1 })}</h3>
            <button class="absolute top-2 left-2 text-red-500 hover:text-red-700 text-xl" onclick="removePortfolioAsset(${asset.id})">&times;</button>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label for="asset-${asset.id}-name" class="text-base font-semibold" data-translate="portfolio_asset_name_label"></label>
                    <input type="text" id="asset-${asset.id}-name" class="w-full mt-1 bg-[#2b2b2b] text-dark-text border border-dark-border rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary" value="${asset.name}" data-translate-placeholder="portfolio_asset_name_placeholder" onchange="updatePortfolioAssetData(${asset.id}, 'name', this.value)">
                </div>
                <div>
                    <label for="asset-${asset.id}-return" class="text-base font-semibold" data-translate="portfolio_asset_return_label"></label>
                    <input type="number" id="asset-${asset.id}-return" class="w-full mt-1 bg-[#2b2b2b] text-dark-text border border-dark-border rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="${_t('portfolio_asset_return_placeholder')}" value="${isNaN(asset.return) ? '' : asset.return}" onchange="updatePortfolioAssetData(${asset.id}, 'return', this.value)">
                </div>
                <div>
                    <label for="asset-${asset.id}-stddev" class="text-base font-semibold" data-translate="portfolio_asset_stddev_label"></label>
                    <input type="number" id="asset-${asset.id}-stddev" class="w-full mt-1 bg-[#2b2b2b] text-dark-text border border-dark-border rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="${_t('portfolio_asset_stddev_placeholder')}" value="${isNaN(asset.stdDev) ? '' : asset.stdDev}" onchange="updatePortfolioAssetData(${asset.id}, 'stdDev', this.value)">
                </div>
                <div class="md:col-span-3">
                    <label for="asset-${asset.id}-weight" class="text-base font-semibold" data-translate="portfolio_asset_weight_label"></label>
                    <input type="number" id="asset-${asset.id}-weight" class="w-full mt-1 bg-[#2b2b2b] text-dark-text border border-dark-border rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="${_t('portfolio_asset_weight_placeholder')}" value="${isNaN(asset.weight) ? '' : asset.weight}" onchange="updatePortfolioAssetData(${asset.id}, 'weight', this.value)">
                </div>
            </div>
            <div class="mt-4 border-t border-dark-border pt-4">
                <h4 class="text-md font-semibold mb-2" data-translate="correlations_title"></h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3" id="asset-${asset.id}-correlations-container">
                    <!-- Correlations will be added here -->
                </div>
            </div>
        `;
        portfolioAssetsContainer.appendChild(assetDiv);

        const correlationsContainer = assetDiv.querySelector(`#asset-${asset.id}-correlations-container`);
        portfolioAssets.forEach(otherAsset => {
            if (otherAsset.id !== asset.id) {
                const correlationDiv = document.createElement('div');
                correlationDiv.className = 'flex items-center gap-2';
                correlationDiv.innerHTML = `
                    <label for="corr-${asset.id}-with-${otherAsset.id}" class="text-sm text-dark-text-muted whitespace-nowrap" data-translate="portfolio_asset_correlation_label"></label>
                    <input type="number" id="corr-${asset.id}-with-${otherAsset.id}" class="flex-grow bg-[#2b2b2b] text-dark-text border border-dark-border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary" step="0.01" min="-1" max="1" placeholder="${_t('portfolio_asset_correlation_placeholder')}" value="${isNaN(asset.correlations[otherAsset.id]) ? '' : asset.correlations[otherAsset.id]}" onchange="updatePortfolioAssetCorrelation(${asset.id}, ${otherAsset.id}, this.value)">
                `;
                correlationsContainer.appendChild(correlationDiv);
            }
        });
    });
    updateLanguageUI(); // Re-apply translations for new elements
}

function updatePortfolioAssetData(assetId, field, value) {
    const asset = portfolioAssets.find(a => a.id === assetId);
    if (asset) {
        if (field === 'name') {
            asset[field] = value;
        } else {
            const parsedValue = parseFloat(value);
            asset[field] = isNaN(parsedValue) ? NaN : parsedValue;
        }
        // updateStatus('portfolio_asset_updated', { name: asset.name }, 'info'); // Too chatty
        resetPortfolioResultsDisplay();
    }
}

function updatePortfolioAssetCorrelation(assetId1, assetId2, value) {
    const asset1 = portfolioAssets.find(a => a.id === assetId1);
    const asset2 = portfolioAssets.find(a => a.id === assetId2);
    if (asset1 && asset2) {
        const parsedValue = parseFloat(value);
        const correlation = isNaN(parsedValue) ? NaN : parsedValue;

        if (correlation < -1 || correlation > 1) {
            Swal.fire(_t('error_title'), _t('correlation_range_error'), 'error');
            // Reset input field if invalid
            document.getElementById(`corr-${assetId1}-with-${assetId2}`).value = isNaN(asset1.correlations[assetId2]) ? '' : asset1.correlations[assetId2];
            return;
        }

        asset1.correlations[asset2.id] = correlation;
        asset2.correlations[asset1.id] = correlation; // Ensure symmetry
        // updateStatus('portfolio_asset_updated', { name: `${asset1.name}-${asset2.name} correlation` }, 'info'); // Too chatty
        resetPortfolioResultsDisplay();
    }
}

// --- Main Calculation Orchestration ---
function calculateMetrics() {
    updateStatus('status_calculating', { dataType: _t('tab_asset_analysis') }, 'info');
    calculatedResults = {}; // Reset results

    if (dataPoints.length === 0) {
        Swal.fire(_t('warning_title'), _t('status_need_data_calc'), 'warning');
        updateStatus('status_need_data_calc', {}, 'warning');
        resetResultsDisplay();
        updateActionButtonsState();
        return;
    }
    if (dataPoints.length < 2) {
        Swal.fire(_t('warning_title'), _t('status_need_data_calc'), 'warning');
        updateStatus('status_need_data_calc', {}, 'warning');
        resetResultsDisplay();
        updateActionButtonsState();
        return;
    }

    const rfRate = parseFloat(rfRateInput.value);
    const expectedMarketReturn = parseFloat(expectedMarketReturnInput.value);

    if (isNaN(rfRate)) {
        Swal.fire(_t('error_title'), _t('status_rf_error'), 'error');
        updateStatus('status_rf_error', {}, 'error');
        resetResultsDisplay();
        updateActionButtonsState();
        return;
    }
    if (isNaN(expectedMarketReturn)) {
        Swal.fire(_t('error_title'), _t('status_expected_market_return_error'), 'error');
        updateStatus('status_expected_market_return_error', {}, 'error');
        resetResultsDisplay();
        updateActionButtonsState();
        return;
    }

    const n = dataPoints.length;
    const mean = calculateMean(dataPoints);
    const stdDev = calculateStdDev(dataPoints);
    const geoMean = calculateGeometricMean(dataPoints);
    const downsideDev = calculateDownsideDeviation(dataPoints);
    const variance = Math.pow(stdDev, 2);
    const cv = mean === 0 ? NaN : stdDev / Math.abs(mean);
    const mddResult = calculateMaxDrawdown(dataPoints);
    const skewness = calculateSkewness(dataPoints);
    const kurtosis = calculateKurtosis(dataPoints);
    const var5 = calculatePercentile(dataPoints, 5);
    const var95 = calculatePercentile(dataPoints, 95);
    const cvar5 = calculateCVaR(dataPoints, 5);
    const maxGain = Math.max(...dataPoints);

    // Regression Analysis (CAPM)
    let regressionParams = { beta: NaN, alpha: NaN, rSquared: NaN, stdErrRegression: NaN, tStatBeta: NaN, pValBeta: NaN, tStatAlpha: NaN, pValAlpha: NaN };
    if (marketDataPoints.length === dataPoints.length && dataPoints.length >= 2) {
        regressionParams = calculateRegression(dataPoints, marketDataPoints);
    }
    const capmExpectedReturn = calculateCAPMExpectedReturn(rfRate, regressionParams.beta, expectedMarketReturn);

    // Benchmark Analysis
    let trackingError = NaN;
    let informationRatio = NaN;
    if (benchmarkDataPoints.length === dataPoints.length && dataPoints.length >= 2) {
        trackingError = calculateTrackingError(dataPoints, benchmarkDataPoints);
        informationRatio = calculateInformationRatio(dataPoints, benchmarkDataPoints);
    }

    // CFA Metrics
    const sharpeRatio = calculateSharpeRatio(dataPoints, rfRate);
    const sortinoRatio = calculateSortinoRatio(dataPoints, rfRate);
    const omegaRatio = calculateOmegaRatio(dataPoints, rfRate); // Using RF as threshold for Omega

    const treynorRatio = calculateTreynorRatio(mean, rfRate, regressionParams.beta);
    const calmarRatio = calculateCalmarRatio(mean, mddResult.maxDrawdown);
    const jensenAlpha = calculateJensenAlpha(mean, rfRate, expectedMarketReturn, regressionParams.beta);
    const m2Measure = calculateM2Measure(mean, stdDev, calculateStdDev(marketDataPoints), rfRate); // Assuming marketDataPoints stdDev is market risk
    const alphaTStat = calculateAlphaTStat(jensenAlpha, trackingError, n); // Using tracking error for alpha t-stat

    calculatedResults = {
        n: n,
        data: dataPoints, // Store data for plotting
        rf: rfRate,
        expectedMarketReturn: expectedMarketReturn,
        mean: mean,
        stdDev: stdDev,
        geoMean: geoMean,
        downsideDev: downsideDev,
        variance: variance,
        cv: cv,
        mdd: mddResult.maxDrawdown,
        mdd_period: mddResult.duration,
        skewness: skewness,
        kurtosis: kurtosis,
        var5: var5,
        var95: var95,
        cvar5: cvar5,
        maxGain: maxGain,
        sharpeRatio: sharpeRatio,
        sortinoRatio: sortinoRatio,
        omegaRatio: omegaRatio,
        treynorRatio: treynorRatio,
        calmarRatio: calmarRatio,
        jensenAlpha: jensenAlpha,
        m2Measure: m2Measure,
        alphaTStat: alphaTStat,
        beta: regressionParams.beta,
        alpha: regressionParams.alpha,
        rSquared: regressionParams.rSquared,
        capmExpectedReturn: capmExpectedReturn,
        regStdErr: regressionParams.stdErrRegression,
        betaTStat: regressionParams.tStatBeta,
        betaPValue: regressionParams.pValBeta,
        alphaPValue: regressionParams.pValAlpha,
        trackingError: trackingError,
        informationRatio: informationRatio
    };

    updateResultsUI(calculatedResults);
    updateActionButtonsState();
    updateStatus('status_calc_done', { dataType: _t('tab_asset_analysis') }, 'success');
}

// --- Equity Valuation Orchestration ---
function calculateEquityValuation() {
    updateStatus('status_calculating', { dataType: _t('equity_valuation_title') }, 'info');
    equityCalculatedResults = {};

    const D0 = parseFloat(currentDividendInput.value);
    const g = parseFloat(dividendGrowthRateInput.value);
    const r = parseFloat(requiredReturnEquityInput.value);
    const EPS = parseFloat(earningsPerShareInput.value);
    const currentPrice = parseFloat(currentSharePriceInput.value);

    if (isNaN(D0) || isNaN(g) || isNaN(r) || isNaN(EPS) || isNaN(currentPrice)) {
        Swal.fire(_t('error_title'), _t('equity_input_error'), 'error');
        updateStatus('status_calc_error', { error: _t('equity_input_error') }, 'error');
        resetEquityResultsDisplay();
        return;
    }

    // DDM / GGM
    if (r <= g) {
        equityCalculatedResults['ddm'] = NaN;
        equityCalculatedResults['ggm'] = NaN;
        Swal.fire(_t('warning_title'), _t('ddm_ggm_error'), 'warning');
    } else {
        equityCalculatedResults['ddm'] = calculateDDM(D0, g, r);
        equityCalculatedResults['ggm'] = calculateGGM(D0 * (1 + g / 100), r, g); // D1 = D0 * (1+g)
    }

    // P/E Ratio
    if (EPS <= 0 || currentPrice <= 0) {
        equityCalculatedResults['peRatio'] = NaN;
        Swal.fire(_t('warning_title'), _t('eps_price_error'), 'warning');
    } else {
        equityCalculatedResults['peRatio'] = calculatePERatio(currentPrice, EPS);
    }

    updateEquityResultsUI();
    updateStatus('status_calc_done', { dataType: _t('equity_valuation_title') }, 'success');
}

// --- Fixed Income Orchestration ---
function calculateFixedIncome() {
    updateStatus('status_calculating', { dataType: _t('fixed_income_title') }, 'info');
    fixedIncomeCalculatedResults = {};

    const faceValue = parseFloat(faceValueInput.value);
    const couponRate = parseFloat(couponRateInput.value);
    const yearsToMaturity = parseFloat(yearsToMaturityInput.value);
    const marketPrice = parseFloat(marketPriceBondInput.value);
    const ytmInput = parseFloat(ytmInputBond.value);
    const couponFrequency = parseInt(couponFrequencySelect.value);

    if (isNaN(faceValue) || isNaN(couponRate) || isNaN(yearsToMaturity) || isNaN(marketPrice) || isNaN(ytmInput) || isNaN(couponFrequency)) {
        Swal.fire(_t('error_title'), _t('bond_input_error'), 'error');
        updateStatus('status_calc_error', { error: _t('bond_input_error') }, 'error');
        resetFixedIncomeResultsDisplay();
        return;
    }

    // Calculate Bond Price (using YTM input)
    fixedIncomeCalculatedResults['bondPrice'] = calculateBondPrice(faceValue, couponRate, yearsToMaturity, ytmInput, couponFrequency);

    // Calculate YTM (using market price input)
    fixedIncomeCalculatedResults['ytm'] = calculateYTM(faceValue, couponRate, yearsToMaturity, marketPrice, couponFrequency);

    // Calculate Duration and Convexity (using calculated YTM if available, otherwise YTM input)
    const ytmForDuration = isFinite(fixedIncomeCalculatedResults['ytm']) ? fixedIncomeCalculatedResults['ytm'] : ytmInput;

    fixedIncomeCalculatedResults['macaulayDuration'] = calculateMacaulayDuration(faceValue, couponRate, yearsToMaturity, ytmForDuration, couponFrequency);
    fixedIncomeCalculatedResults['modifiedDuration'] = calculateModifiedDuration(fixedIncomeCalculatedResults['macaulayDuration'], ytmForDuration, couponFrequency);
    fixedIncomeCalculatedResults['convexity'] = calculateConvexity(faceValue, couponRate, yearsToMaturity, ytmForDuration, couponFrequency);

    updateFixedIncomeResultsUI();
    if (plotBondPriceYieldButton) plotBondPriceYieldButton.disabled = false;
    updateStatus('status_calc_done', { dataType: _t('fixed_income_title') }, 'success');
}

// --- Portfolio Management Orchestration ---
function calculatePortfolioManagement() {
    updateStatus('status_calculating', { dataType: _t('portfolio_management_title') }, 'info');
    portfolioCalculatedResults = {};

    if (portfolioAssets.length < 2) {
        Swal.fire(_t('error_title'), _t('portfolio_min_assets_error'), 'error');
        updateStatus('status_calc_error', { error: _t('portfolio_min_assets_error') }, 'error');
        resetPortfolioResultsDisplay();
        return;
    }

    let totalWeight = 0;
    let hasError = false;
    const validAssets = [];

    portfolioAssets.forEach(asset => {
        const r = parseFloat(asset.return);
        const std = parseFloat(asset.stdDev);
        const w = parseFloat(asset.weight);

        if (isNaN(r) || isNaN(std) || isNaN(w) || w < 0) {
            Swal.fire(_t('error_title'), _t('portfolio_input_error'), 'error');
            updateStatus('status_calc_error', { error: _t('portfolio_input_error') }, 'error');
            hasError = true;
            return;
        }
        validAssets.push({ ...asset, return: r, stdDev: std, weight: w });
        totalWeight += w;
    });

    if (hasError) {
        resetPortfolioResultsDisplay();
        return;
    }

    if (Math.abs(totalWeight - 100) > 0.01) { // Allow for minor floating point inaccuracies
        Swal.fire(_t('warning_title'), _t('portfolio_weights_error'), 'warning');
        // Do not return, proceed with calculation but highlight potential issue
    }

    // Calculate Expected Portfolio Return
    let portfolioExpectedReturn = 0;
    validAssets.forEach(asset => {
        portfolioExpectedReturn += (asset.return / 100) * (asset.weight / 100);
    });
    portfolioExpectedReturn *= 100; // Convert back to percentage

    // Calculate Portfolio Variance and Standard Deviation
    let portfolioVariance = 0;
    let covarianceSum = 0;

    for (let i = 0; i < validAssets.length; i++) {
        const asset_i = validAssets[i];
        const w_i = asset_i.weight / 100;
        const std_i = asset_i.stdDev / 100;

        // Add own variance component
        portfolioVariance += Math.pow(w_i, 2) * Math.pow(std_i, 2);

        // Add covariance components
        for (let j = i + 1; j < validAssets.length; j++) {
            const asset_j = validAssets[j];
            const w_j = asset_j.weight / 100;
            const std_j = asset_j.stdDev / 100;
            const correlation = asset_i.correlations[asset_j.id];

            if (isNaN(correlation) || correlation < -1 || correlation > 1) {
                Swal.fire(_t('error_title'), _t('correlation_range_error'), 'error');
                updateStatus('status_calc_error', { error: _t('correlation_range_error') }, 'error');
                resetPortfolioResultsDisplay();
                return;
            }
            const covariance_ij = std_i * std_j * correlation;
            covarianceSum += 2 * w_i * w_j * covariance_ij;
        }
    }
    portfolioVariance += covarianceSum;

    const portfolioStdDev = Math.sqrt(portfolioVariance) * 100; // Convert back to percentage

    portfolioCalculatedResults['expectedReturn'] = portfolioExpectedReturn;
    portfolioCalculatedResults['stdDev'] = portfolioStdDev;
    // For covariance, we can show the average or sum of pairwise covariances, but for now, let's just show the portfolio variance.
    // Or, we can show the sum of all covariance terms (2 * wi * wj * cov_ij)
    portfolioCalculatedResults['portfolioVariance'] = portfolioVariance; // Store portfolio variance here for display, as it's the direct result of the sum.

    updatePortfolioResultsUI();
    updateStatus('status_calc_done', { dataType: _t('portfolio_management_title') }, 'success');
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

function updateResultsUI(results) {
    const updateSpan = (id, value, options = {}, highlightType = 'neutral') => {
        const element = document.getElementById(id);
        if (!element) return;
        
        let displayValue = '-';
        if (!isNaN(value) && isFinite(value)) {
            displayValue = formatNumber(value, options.digits || 2, options.addPercent || false);
        }
        
        element.textContent = displayValue;
        element.className = `font-mono ${highlightType === 'pos' ? 'text-highlight-pos' : 
            highlightType === 'neg' ? 'text-highlight-neg' : 'text-highlight-neutral'}`;
    };

    // معیارهای پایه
    updateSpan('result-count', results.n, { digits: 0 });
    updateSpan('result-mean', results.mean, { addPercent: true });
    updateSpan('result-gm', results.geoMean, { addPercent: true });
    updateSpan('result-std', results.stdDev, { addPercent: true });
    updateSpan('result-dsd', results.downsideDev, { addPercent: true });
    updateSpan('result-var', results.variance, { addPercent: true });
    updateSpan('result-cv', results.cv);
    updateSpan('result-mdd', results.mdd, { addPercent: true }, 'neg');
    updateSpan('result-mdd-period', results.mdd_period, { digits: 0 }); // Added mdd_period
    updateSpan('result-skew', results.skewness);
    updateSpan('result-kurt', results.kurtosis);
    updateSpan('result-var5', results.var5, { addPercent: true }, 'neg');
    updateSpan('result-var95', results.var95, { addPercent: true }, 'pos');
    updateSpan('result-cvar5', results.cvar5, { addPercent: true }, 'neg');
    updateSpan('result-max-gain', results.maxGain, { addPercent: true }, 'pos');
    updateSpan('result-sharpe', results.sharpeRatio);
    updateSpan('result-sortino', results.sortinoRatio);
    updateSpan('result-omega', results.omegaRatio);

    // معیارهای جدید CFA
    updateSpan('result-treynor', results.treynorRatio);
    updateSpan('result-calmar', results.calmarRatio);
    updateSpan('result-jensen-alpha', results.jensenAlpha, { addPercent: true });
    updateSpan('result-m2', results.m2Measure, { addPercent: true });
    updateSpan('result-alpha-t-stat', results.alphaTStat);

    // معیارهای رگرسیون
    if (results.beta !== undefined) {
        updateSpan('result-beta', results.beta);
        updateSpan('result-alpha', results.alpha, { addPercent: true });
        updateSpan('result-rsquared', results.rSquared);
        updateSpan('result-capm-er', results.capmExpectedReturn, { addPercent: true });
        updateSpan('result-reg-stderr', results.regStdErr);
        updateSpan('result-beta-tstat', results.betaTStat);
        updateSpan('result-beta-pvalue', results.betaPValue);
        updateSpan('result-alpha-tstat', results.alphaTStat);
        updateSpan('result-alpha-pvalue', results.alphaPValue);
    }

    // معیارهای معیار
    if (results.trackingError !== undefined) {
        updateSpan('result-tracking-error', results.trackingError, { addPercent: true });
        updateSpan('result-information-ratio', results.informationRatio);
    }
}

function resetEquityResultsDisplay() {
    if (!equityResultsDisplay) return;
    equityResultsDisplay.querySelectorAll('span[id^="result-"]').forEach(span => {
        span.textContent = _t('value_invalid');
        span.className = 'font-mono text-dark-text-muted';
    });
}

function updateEquityResultsUI() {
    if (!equityResultsDisplay || Object.keys(equityCalculatedResults).length === 0) {
        resetEquityResultsDisplay();
        return;
    }
    const results = equityCalculatedResults;
    const updateSpan = (id, value, options, highlightType = 'neutral') => {
        const span = document.getElementById(id);
        if (span) {
            const formattedValue = formatNumber(value, options?.digits, options?.addPercent);
            span.textContent = formattedValue;
            span.className = 'font-mono ';

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

    updateSpan('result-ddm-value', results.ddm, {digits:2});
    updateSpan('result-ggm-value', results.ggm, {digits:2});
    updateSpan('result-pe-ratio', results.peRatio, {digits:2});
}

function resetFixedIncomeResultsDisplay() {
    if (!fixedIncomeResultsDisplay) return;
    fixedIncomeResultsDisplay.querySelectorAll('span[id^="result-"]').forEach(span => {
        span.textContent = _t('value_invalid');
        span.className = 'font-mono text-dark-text-muted';
    });
    if (plotBondPriceYieldButton) plotBondPriceYieldButton.disabled = true;
}

function updateFixedIncomeResultsUI() {
    if (!fixedIncomeResultsDisplay || Object.keys(fixedIncomeCalculatedResults).length === 0) {
        resetFixedIncomeResultsDisplay();
        return;
    }
    const results = fixedIncomeCalculatedResults;
    const updateSpan = (id, value, options, highlightType = 'neutral') => {
        const span = document.getElementById(id);
        if (span) {
            const formattedValue = formatNumber(value, options?.digits, options?.addPercent);
            span.textContent = formattedValue;
            span.className = 'font-mono ';

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

    updateSpan('result-bond-price', results.bondPrice, {digits:2});
    updateSpan('result-ytm', results.ytm, {digits:3, addPercent:true});
    updateSpan('result-macaulay-duration', results.macaulayDuration, {digits:3});
    updateSpan('result-modified-duration', results.modifiedDuration, {digits:3});
    updateSpan('result-convexity', results.convexity, {digits:4});

    if (plotBondPriceYieldButton) plotBondPriceYieldButton.disabled = false;
}

function resetPortfolioResultsDisplay() {
    if (!portfolioResultsDisplay) return;
    portfolioResultsDisplay.querySelectorAll('span[id^="result-"]').forEach(span => {
        span.textContent = _t('value_invalid');
        span.className = 'font-mono text-dark-text-muted';
    });
}

function updatePortfolioResultsUI() {
    if (!portfolioResultsDisplay || Object.keys(portfolioCalculatedResults).length === 0) {
        resetPortfolioResultsDisplay();
        return;
    }
    const results = portfolioCalculatedResults;
    const updateSpan = (id, value, options, highlightType = 'neutral') => {
        const span = document.getElementById(id);
        if (span) {
            const formattedValue = formatNumber(value, options?.digits, options?.addPercent);
            span.textContent = formattedValue;
            span.className = 'font-mono ';

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

    updateSpan('result-portfolio-expected-return', results.expectedReturn, {digits:2, addPercent:true}, 'posneg');
    updateSpan('result-portfolio-stddev', results.stdDev, {digits:2, addPercent:true}, 'neutral');
    updateSpan('result-portfolio-variance', results.portfolioVariance, {digits:4, addPercent:true}, 'neutral'); // Display portfolio variance
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

    // Portfolio Management specific button state
    if (calculatePortfolioButton) calculatePortfolioButton.disabled = portfolioAssets.length < 2;
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
    // Special handling for bond price-yield curve plot
    if (plotFunc.name === 'plotBondPriceYieldCurveLogic') {
        if (Object.keys(fixedIncomeCalculatedResults).length === 0 || isNaN(fixedIncomeCalculatedResults.bondPrice)) {
            Swal.fire(_t('warning_title'), _t('status_need_data_plot'), 'warning');
            updateStatus('status_need_data_plot', {}, 'warning');
            return;
        }
        // For bond plot, we need the original inputs, not just calculated results
        const faceValue = parseFloat(faceValueInput.value);
        const couponRate = parseFloat(couponRateInput.value);
        const yearsToMaturity = parseFloat(yearsToMaturityInput.value);
        const couponFrequency = parseInt(couponFrequencySelect.value);

        if (isNaN(faceValue) || isNaN(couponRate) || isNaN(yearsToMaturity) || isNaN(couponFrequency)) {
            Swal.fire(_t('error_title'), _t('bond_input_error'), 'error');
            updateStatus('status_calc_error', { error: _t('bond_input_error') }, 'error');
            return;
        }
        updateStatus(texts[titleKey] ? `status_plotting_${titleKey.split('_')[1]}` : 'status_plotting_hist', {}, 'info');
        try {
            const plotDefinition = plotFunc(faceValue, couponRate, yearsToMaturity, couponFrequency);
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
        return;
    }


    // Original asset analysis plots
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

function plotBondPriceYieldCurveLogic(faceValue, couponRate, yearsToMaturity, couponFrequency) {
    const responsiveParams = getResponsiveLayoutParams();
    const yields = [];
    const prices = [];
    // Generate yields from 0.1% to 20% (or more dynamically)
    for (let y = 0.1; y <= 20.0; y += 0.1) {
        yields.push(y);
        prices.push(calculateBondPrice(faceValue, couponRate, yearsToMaturity, y, couponFrequency));
    }

    const trace = {
        x: yields,
        y: prices,
        mode: 'lines',
        type: 'scatter',
        name: _t('bond_price_label'),
        line: { color: PRIMARY_COLOR, width: responsiveParams.lineWidth }
    };

    const layout = {
        title: { text: _t('bond_price_yield_plot_title'), font: { size: responsiveParams.titleFontSize, color: DARK_TEXT_COLOR }, x: 0.5, xanchor: 'center' },
        xaxis: {
            title: { text: _t('plot_axis_yield'), font: { size: responsiveParams.baseFontSize, color: DARK_TEXT_COLOR } },
            color: DARK_TEXT_COLOR,
            gridcolor: DARK_BORDER_COLOR,
            zeroline: true,
            zerolinecolor: DARK_MUTED_COLOR,
            tickformat: ',.1f',
            tickfont: { size: responsiveParams.baseFontSize - 1, color: DARK_TEXT_COLOR }
        },
        yaxis: {
            title: { text: _t('plot_axis_bond_price'), font: { size: responsiveParams.baseFontSize, color: DARK_TEXT_COLOR } },
            color: DARK_TEXT_COLOR,
            gridcolor: DARK_BORDER_COLOR,
            zeroline: true,
            zerolinecolor: DARK_MUTED_COLOR,
            tickformat: ',',
            tickfont: { size: responsiveParams.baseFontSize - 1, color: DARK_TEXT_COLOR }
        },
        plot_bgcolor: DARK_CARD_COLOR,
        paper_bgcolor: DARK_BACKGROUND_COLOR,
        font: { color: DARK_TEXT_COLOR, size: responsiveParams.baseFontSize },
        showlegend: false,
        margin: responsiveParams.margin,
        hovermode: 'closest'
    };

    return { plotData: [trace], layout };
}


// --- Export ---
function downloadBlob(blob, filename) { const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = filename; document.body.appendChild(link); link.click(); document.body.removeChild(link); URL.revokeObjectURL(link.href); }
function exportResultsToTxtFile() {
    updateStatus('status_saving_results', {}, 'info');
    const lines = [];
    const now = new Date();

    lines.push(`========== ${_t('app_title')} ==========`);
    lines.push(`Date: ${now.toLocaleString(currentLang === 'fa' ? 'fa-IR' : 'en-US')}`);
    lines.push("\n");

    // Asset Analysis Results
    if (Object.keys(calculatedResults).length > 0 && calculatedResults.n > 0) {
        const results = calculatedResults;
        lines.push(`--- ${_t('results_title')} (${_t('tab_asset_analysis')}) ---`);
        lines.push(`${_t('data_count')}: ${formatNumber(results.n, 0)}`);
        lines.push(`Risk-Free Rate: ${formatNumber(results.rf, 2, true)}`);
        lines.push(`Expected Market Return: ${formatNumber(results.expectedMarketReturn, 2, true)}`);
        lines.push("-".repeat(50));
        const resOrder = [
            'mean', 'gm', 'std', 'dsd', 'variance', 'cv', 'mdd', 'mdd_period', 'skewness', 'kurtosis',
            'var5', 'var95', 'cvar5', 'maxGain', 'sharpeRatio', 'sortinoRatio', 'omegaRatio',
            'treynorRatio', 'calmarRatio', 'jensenAlpha', 'm2Measure', 'alphaTStat',
            'trackingError', 'informationRatio',
            'beta', 'alpha', 'rSquared', 'capmExpectedReturn', 'regStdErr',
            'betaTStat', 'betaPValue', 'alphaTStat', 'alphaPValue'
        ];
        const resLabels = {
            'mean': 'mean_label', 'gm': 'geo_mean_label', 'std': 'std_dev_label', 'dsd': 'downside_dev_label',
            'variance': 'variance_label', 'cv': 'cv_label', 'mdd': 'mdd_label', 'mdd_period': 'mdd_period_label',
            'skewness': 'skewness_label', 'kurtosis': 'kurtosis_label', 'var5': 'var_label', 'var95': 'var_95_label',
            'cvar5': 'cvar_label', 'maxGain': 'max_gain_label', 'sharpeRatio': 'sharpe_label', 'sortinoRatio': 'sortino_label',
            'omegaRatio': 'omega_label',
            'treynorRatio': 'treynor_ratio_label', 'calmarRatio': 'calmar_ratio_label', 'jensenAlpha': 'jensen_alpha_label',
            'm2Measure': 'm2_measure_label', 'alphaTStat': 'alpha_t_stat_label',
            'trackingError': 'tracking_error_label', 'informationRatio': 'information_ratio_label',
            'beta': 'beta_label', 'alpha': 'alpha_label', 'rSquared': 'rsquared_label',
            'capmExpectedReturn': 'capm_expected_return_label', 'regStdErr': 'reg_stderr_label',
            'betaTStat': 'beta_t_stat_label', 'betaPValue': 'beta_p_value_label',
            'alphaPValue': 'alpha_p_value_label'
        };
        resOrder.forEach(key => {
            if(results.hasOwnProperty(key) && !isNaN(results[key])) {
                let value = results[key];
                let addPercent = false;
                let digits = 2;

                // Determine formatting based on key
                if (['mean', 'gm', 'std', 'dsd', 'mdd', 'var5', 'var95', 'cvar5', 'maxGain', 'alpha', 'trackingError', 'capmExpectedReturn'].includes(key)) {
                    addPercent = true;
                    digits = 2;
                } else if (['rSquared', 'beta', 'cv', 'skewness', 'kurtosis', 'sharpeRatio', 'sortinoRatio', 'omegaRatio', 'treynorRatio', 'calmarRatio', 'jensenAlpha', 'm2Measure', 'alphaTStat', 'informationRatio', 'regStdErr', 'betaTStat', 'betaPValue', 'alphaPValue'].includes(key)) {
                    digits = 3; // More precision for ratios/stats
                } else if (key === 'mdd_period' || key === 'n') {
                    digits = 0;
                } else if (key === 'variance') {
                    addPercent = true;
                    digits = 4; // Variance can be small
                }

                lines.push(`${_t(resLabels[key] || key)}: ${formatNumber(value, digits, addPercent)}`);
            }
        });
        lines.push("\n" + "=".repeat(50));
        lines.push(`Input Asset Data (${dataPoints.length} points):`);
        lines.push("-".repeat(50));
        lines.push(...dataPoints.map((p, i) => `${formatNumber(i + 1, 0)}. ${formatNumber(p, 4)}%`));
        if(marketDataPoints.length > 0) { lines.push("\nMarket Data:"); lines.push(...marketDataPoints.map((p, i) => `${formatNumber(i + 1, 0)}. ${formatNumber(p, 4)}%`));}
        if(benchmarkDataPoints.length > 0) { lines.push("\nBenchmark Data:"); lines.push(...benchmarkDataPoints.map((p, i) => `${formatNumber(i + 1, 0)}. ${formatNumber(p, 4)}%`));}
        lines.push("=".repeat(50));
        lines.push("\n");
    }

    // Equity Valuation Results
    if (Object.keys(equityCalculatedResults).length > 0) {
        const results = equityCalculatedResults;
        lines.push(`--- ${_t('equity_results_title')} ---`);
        lines.push("-".repeat(50));
        lines.push(`${_t('ddm_value_label')}: ${formatNumber(results.ddm, 2)}`);
        lines.push(`${_t('ggm_value_label')}: ${formatNumber(results.ggm, 2)}`);
        lines.push(`${_t('pe_ratio_label')}: ${formatNumber(results.peRatio, 2)}`);
        lines.push("=".repeat(50));
        lines.push("\n");
    }

    // Fixed Income Results
    if (Object.keys(fixedIncomeCalculatedResults).length > 0) {
        const results = fixedIncomeCalculatedResults;
        lines.push(`--- ${_t('fixed_income_results_title')} ---`);
        lines.push("-".repeat(50));
        lines.push(`${_t('bond_price_label')}: ${formatNumber(results.bondPrice, 2)}`);
        lines.push(`${_t('ytm_label')}: ${formatNumber(results.ytm, 3, true)}`);
        lines.push(`${_t('macaulay_duration_label')}: ${formatNumber(results.macaulayDuration, 3)}`);
        lines.push(`${_t('modified_duration_label')}: ${formatNumber(results.modifiedDuration, 3)}`);
        lines.push(`${_t('convexity_label')}: ${formatNumber(results.convexity, 4)}`);
        lines.push("=".repeat(50));
        lines.push("\n");
    }

    // Portfolio Management Results
    if (Object.keys(portfolioCalculatedResults).length > 0) {
        const results = portfolioCalculatedResults;
        lines.push(`--- ${_t('portfolio_results_title')} ---`);
        lines.push("-".repeat(50));
        lines.push(`${_t('portfolio_expected_return_label')}: ${formatNumber(results.expectedReturn, 2, true)}`);
        lines.push(`${_t('portfolio_stddev_label')}: ${formatNumber(results.stdDev, 2, true)}`);
        lines.push(`${_t('portfolio_variance_label')}: ${formatNumber(results.portfolioVariance, 4, true)}`);
        lines.push("=".repeat(50));
        lines.push("\n");
    }

    if (lines.length <= 4) { // Only header and date means no actual results
        Swal.fire(_t('warning_title'), _t('status_no_results'), 'warning');
        return;
    }

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const filename = `FinancialAnalysisResults_${new Date().toISOString().slice(0,10)}.txt`;
    downloadBlob(blob, filename);
    updateStatus('status_saving_txt_success', { filename }, 'success');
}

function exportResultsToExcelFile() {
    updateStatus('status_saving_results', {}, 'info');
    const wb = XLSX.utils.book_new();
    const now = new Date();

    // Asset Analysis Sheet
    if (Object.keys(calculatedResults).length > 0 && calculatedResults.n > 0) {
        const results = calculatedResults;
        const assetResultsData = [
            [{ v: _t('app_title'), s: { font: { sz: 14, bold: true } } }],
            [{ v: `Date: ${now.toLocaleString(currentLang === 'fa' ? 'fa-IR' : 'en-US')}` }],
            [],
            [{ v: _t('results_title') + ` (${_t('tab_asset_analysis')})`, s: { font: { bold: true } } }],
            [_t('data_count'), results.n],
            [_t('rf_title'), formatNumber(results.rf, 2, true)],
            [_t('expected_market_return_title'), formatNumber(results.expectedMarketReturn, 2, true)],
            [],
        ];
        const resOrder = ['mean','geoMean','stdDev','downsideDev','variance','cv','mdd','mdd_period','skewness','kurtosis','var5','var95','cvar5','maxGain','sharpeRatio','sortinoRatio','omegaRatio', 'treynorRatio', 'calmarRatio', 'jensenAlpha', 'm2Measure', 'alphaTStat', 'trackingError', 'informationRatio', 'beta','alpha','rSquared','capmExpectedReturn','regStdErr','betaTStat','betaPValue','alphaPValue'];
        const resLabels = {
            'mean':'mean_label', 'geoMean':'geo_mean_label', 'stdDev':'std_dev_label', 'downsideDev':'downside_dev_label',
            'variance':'variance_label', 'cv':'cv_label', 'mdd':'mdd_label', 'mdd_period':'mdd_period_label',
            'skewness':'skewness_label', 'kurtosis':'kurtosis_label', 'var5':'var_label', 'var95':'var_95_label',
            'cvar5':'cvar_label', 'maxGain':'max_gain_label', 'sharpeRatio':'sharpe_label', 'sortinoRatio':'sortino_label',
            'omegaRatio':'omega_label',
            'treynorRatio':'treynor_ratio_label', 'calmarRatio':'calmar_ratio_label', 'jensenAlpha':'jensen_alpha_label',
            'm2Measure':'m2_measure_label', 'alphaTStat':'alpha_t_stat_label',
            'trackingError':'tracking_error_label', 'informationRatio':'information_ratio_label',
            'beta':'beta_label', 'alpha':'alpha_label', 'rSquared':'rsquared_label',
            'capmExpectedReturn':'capm_expected_return_label', 'regStdErr':'reg_stderr_label',
            'betaTStat':'beta_t_stat_label', 'betaPValue':'beta_p_value_label',
            'alphaPValue':'alpha_p_value_label'
        };
        resOrder.forEach(key => {
            if(results.hasOwnProperty(key) && !isNaN(results[key])) {
                assetResultsData.push([_t(resLabels[key] || key + '_label'), formatNumber(results[key], (key==='var'||key==='rSquared'||key==='beta'||key==='alpha'||key==='cv'||key==='skew'||key==='kurt'||key==='sh'||key==='so'||key==='omega'||key==='informationRatio'||key==='regStdErr'||key==='betaTStat'||key==='alphaTStat'||key==='betaPValue'||key==='alphaPValue'?3:2), (key.includes('Return')||key==='mean'||key==='gm'||key==='std'||key==='dsd'||key==='mdd'||key==='var5'||key==='var95'||key==='cvar5'||key==='max_gain'||key==='alpha'||key==='trackingError'))]);
            }
        });
        assetResultsData.push([]);
        assetResultsData.push([_t('excel_sheet_raw_data_title')]);
        assetResultsData.push([_t('col_return')]);
        dataPoints.forEach(p => assetResultsData.push([p]));
        if(marketDataPoints.length > 0) { assetResultsData.push([]); assetResultsData.push(['Market Data']); marketDataPoints.forEach(p => assetResultsData.push([p]));}
        if(benchmarkDataPoints.length > 0) { assetResultsData.push([]); assetResultsData.push(['Benchmark Data']); benchmarkDataPoints.forEach(p => assetResultsData.push([p]));}
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(assetResultsData), _t('tab_asset_analysis'));
    }

    // Equity Valuation Sheet
    if (Object.keys(equityCalculatedResults).length > 0) {
        const results = equityCalculatedResults;
        const equityResultsData = [
            [{ v: _t('equity_results_title'), s: { font: { bold: true } } }],
            [],
            [_t('ddm_value_label'), results.ddm],
            [_t('ggm_value_label'), results.ggm],
            [_t('pe_ratio_label'), results.peRatio],
        ];
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(equityResultsData), _t('tab_equity_valuation'));
    }

    // Fixed Income Sheet
    if (Object.keys(fixedIncomeCalculatedResults).length > 0) {
        const results = fixedIncomeCalculatedResults;
        const fixedIncomeResultsData = [
            [{ v: _t('fixed_income_results_title'), s: { font: { bold: true } } }],
            [],
            [_t('bond_price_label'), results.bondPrice],
            [_t('ytm_label'), results.ytm],
            [_t('macaulay_duration_label'), results.macaulayDuration],
            [_t('modified_duration_label'), results.modifiedDuration],
            [_t('convexity_label'), results.convexity],
        ];
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(fixedIncomeResultsData), _t('tab_fixed_income'));
    }

    // Portfolio Management Sheet
    if (Object.keys(portfolioCalculatedResults).length > 0) {
        const results = portfolioCalculatedResults;
        const portfolioResultsData = [
            [{ v: _t('portfolio_results_title'), s: { font: { bold: true } } }],
            [],
            [_t('portfolio_expected_return_label'), results.expectedReturn],
            [_t('portfolio_stddev_label'), results.stdDev],
            [_t('portfolio_variance_label'), results.portfolioVariance],
        ];
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(portfolioResultsData), _t('tab_portfolio_management'));
    }

    if (wb.SheetNames.length === 0) {
        Swal.fire(_t('warning_title'), _t('status_no_results'), 'warning');
        return;
    }

    const filename = `FinancialAnalysisResults_${now.toISOString().slice(0,10)}.xlsx`;
    XLSX.writeFile(wb, filename);
    updateStatus('status_saving_excel_success', { filename }, 'success');
}

// --- Tooltip & Modal Handlers ---
function initializeSweetAlertTooltips() { document.body.addEventListener('click', (event) => { const icon = event.target.closest('.tooltip-icon'); if (!icon) return; event.preventDefault(); const tooltipKey = icon.getAttribute('data-tooltip-key'); if (!tooltipKey) return; const tooltipText = _t(tooltipKey); if (!tooltipText || tooltipText === tooltipKey) return; Swal.fire({ title: `<strong class="text-lg font-semibold">${_t(tooltipKey.replace('_tooltip','_label') || _t('info_title'))}</strong>`, html: `<div class="text-sm text-left rtl:text-right leading-relaxed">${tooltipText.replace(/\n/g, '<br>')}</div>`, icon: 'info', confirmButtonText: _t('ok_button'), customClass: { popup: 'swal2-popup', title: 'swal2-title', htmlContainer: 'swal2-html-container', confirmButton: 'swal2-confirm', closeButton: 'swal2-close' }, showCloseButton: true }); });}
function closeModal() { if (plotModal) { plotModal.classList.add('hidden'); plotModal.classList.remove('flex'); } document.body.style.overflow = 'auto'; if (plotContainer) Plotly.purge(plotContainer); window.removeEventListener('keydown', escapeKeyHandler); if(plotModal) plotModal.removeEventListener('click', backdropClickHandler); }
function closeModalHandler() { closeModal(); }
function backdropClickHandler(event) { if (event.target === plotModal) closeModal(); }
function escapeKeyHandler(event) { if (event.key === 'Escape') closeModal(); }

// --- Tab Switching Logic ---
function switchTab(tabId) {
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });

    document.getElementById(`${tabId}-tab`).classList.add('active');
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
}


// --- Event Listeners & Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    // Language
    const savedLang = localStorage.getItem('preferredLang');
    if (savedLang && langSelect) langSelect.value = savedLang;
    currentLang = langSelect ? langSelect.value : 'fa';
    updateLanguageUI();
    if (langSelect) langSelect.addEventListener('change', () => { localStorage.setItem('preferredLang', langSelect.value); updateLanguageUI(); });

    // Tab Navigation
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

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

    // Equity Valuation
    if (calculateEquityButton) calculateEquityButton.addEventListener('click', calculateEquityValuation);

    // Fixed Income
    if (calculateBondButton) calculateBondButton.addEventListener('click', calculateFixedIncome);
    if (plotBondPriceYieldButton) plotBondPriceYieldButton.addEventListener('click', () => plotActionWrapper(plotBondPriceYieldCurveLogic, 'bond_price_yield_plot_title'));

    // Portfolio Management
    if (addPortfolioAssetButton) addPortfolioAssetButton.addEventListener('click', addPortfolioAsset);
    if (calculatePortfolioButton) calculatePortfolioButton.addEventListener('click', calculatePortfolioManagement);

    // Calculate (Asset Analysis)
    if (calculateButton) calculateButton.addEventListener('click', calculateMetrics);

    // Initial setup for Portfolio Management tab
    if (portfolioAssets.length === 0) {
        addPortfolioAsset(); // Add first asset
        addPortfolioAsset(); // Add second asset
    }
    updatePortfolioAssetUI();

    // Plot Buttons (Asset Analysis)
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
    resetEquityResultsDisplay();
    resetFixedIncomeResultsDisplay();
    resetPortfolioResultsDisplay();
    initializeSweetAlertTooltips();
    updateStatus('status_ready');
    console.log("Application initialized.");
});

    // Add missing item prefix keys for generic display
    texts['market_data_item_prefix'] = { 'en': 'Market {index}:', 'fa': 'بازار {index}:' };
    texts['benchmark_data_item_prefix'] = { 'en': 'Benchmark {index}:', 'fa': 'معیار {index}:' };
    texts['correlations_title'] = { 'en': 'Correlations:', 'fa': 'همبستگی‌ها:' };
    texts['delete_data_point_confirm'] = { 'en': 'Delete data point {index}?', 'fa': 'داده {index} حذف شود؟' };

// --- Advanced Statistical Functions (using simple-statistics) ---
function calculateSkewness(data) {
    if (!data || data.length < 3) return NaN;
    if (typeof ss === 'undefined' || typeof ss.skewness === 'undefined') {
        console.error("simple-statistics (ss) is not loaded or skewness function is missing.");
        return NaN;
    }
    try { return ss.skewness(data); } catch (e) { console.error("Error calculating skewness:", e); return NaN; }
}

function calculateKurtosis(data) {
    if (!data || data.length < 4) return NaN;
    if (typeof ss === 'undefined' || typeof ss.kurtosis === 'undefined') {
        console.error("simple-statistics (ss) is not loaded or kurtosis function is missing.");
        return NaN;
    }
    try { return ss.kurtosis(data); } catch (e) { console.error("Error calculating kurtosis:", e); return NaN; }
}

function calculateCVaR(data, confidenceLevel = 5) {
    if (!data || data.length === 0 || confidenceLevel <= 0 || confidenceLevel >= 100) return NaN;
    const sortedData = [...data].sort((a, b) => a - b);
    // VaR at confidenceLevel (e.g., 5%) means the value at the (100-confidenceLevel)th percentile.
    // CVaR is the average of returns *below* (or equal to) VaR.
    const varValue = calculatePercentile(data, confidenceLevel); // This is the VaR value (e.g., 5th percentile)

    const tailReturns = sortedData.filter(r => r <= varValue); // Returns that are worse than or equal to VaR
    if (tailReturns.length === 0) return NaN; // No returns in the tail
    return calculateMean(tailReturns);
}

// --- CFA Metrics ---

// Treynor Ratio: (Portfolio Return - Risk-Free Rate) / Beta
function calculateTreynorRatio(portfolioReturnPerc, riskFreeRatePerc, beta) {
    if (isNaN(portfolioReturnPerc) || isNaN(riskFreeRatePerc) || isNaN(beta) || beta === 0) return NaN;
    const portfolioReturn_dec = portfolioReturnPerc / 100;
    const riskFreeRate_dec = riskFreeRatePerc / 100;
    const excessReturn = portfolioReturn_dec - riskFreeRate_dec;
    return excessReturn / beta;
}

// Calmar Ratio: (Annualized Return) / |Max Drawdown|
function calculateCalmarRatio(annualizedReturnPerc, maxDrawdownPerc) {
    if (isNaN(annualizedReturnPerc) || isNaN(maxDrawdownPerc) || maxDrawdownPerc === 0) return NaN;
    const annualizedReturn_dec = annualizedReturnPerc / 100;
    const maxDrawdown_dec = maxDrawdownPerc / 100;
    return annualizedReturn_dec / Math.abs(maxDrawdown_dec);
}

// Jensen's Alpha: Portfolio Return - [Risk-Free Rate + Beta * (Market Return - Risk-Free Rate)]
function calculateJensenAlpha(portfolioReturnPerc, riskFreeRatePerc, marketReturnPerc, beta) {
    if (isNaN(portfolioReturnPerc) || isNaN(riskFreeRatePerc) || isNaN(marketReturnPerc) || isNaN(beta)) return NaN;
    const portfolioReturn_dec = portfolioReturnPerc / 100;
    const riskFreeRate_dec = riskFreeRatePerc / 100;
    const marketReturn_dec = marketReturnPerc / 100;
    return portfolioReturn_dec - (riskFreeRate_dec + beta * (marketReturn_dec - riskFreeRate_dec));
}

// M2 Measure (Modigliani-Modigliani Measure): Risk-Free Rate + [(Portfolio Return - Risk-Free Rate) * (Market StdDev / Portfolio StdDev)]
function calculateM2Measure(portfolioReturnPerc, portfolioStdDevPerc, marketStdDevPerc, riskFreeRatePerc) {
    if (isNaN(portfolioReturnPerc) || isNaN(portfolioStdDevPerc) || isNaN(marketStdDevPerc) || isNaN(riskFreeRatePerc) || portfolioStdDevPerc === 0) return NaN;
    const portfolioReturn_dec = portfolioReturnPerc / 100;
    const portfolioStdDev_dec = portfolioStdDevPerc / 100;
    const marketStdDev_dec = marketStdDevPerc / 100;
    const riskFreeRate_dec = riskFreeRatePerc / 100;
    return riskFreeRate_dec + ((portfolioReturn_dec - riskFreeRate_dec) * (marketStdDev_dec / portfolioStdDev_dec));
}

// Alpha T-Statistic: Alpha / (Tracking Error / sqrt(N))
function calculateAlphaTStat(alpha, trackingError, n) {
    if (isNaN(alpha) || isNaN(trackingError) || isNaN(n) || n <= 1 || trackingError === 0) return NaN;
    return alpha / (trackingError / Math.sqrt(n));
}

// Sharpe Ratio: (Portfolio Return - Risk-Free Rate) / Portfolio Standard Deviation
function calculateSharpeRatio(returns, riskFreeRatePerc) {
    if (!returns || returns.length === 0) return NaN;
    const rf_dec = riskFreeRatePerc / 100; // Convert RF to decimal for calculation
    const excessReturns = returns.map(r => r / 100 - rf_dec); // Convert returns to decimal and subtract RF
    const meanExcessReturn = calculateMean(excessReturns);
    const stdDevExcessReturn = calculateStdDev(excessReturns);
    if (stdDevExcessReturn === 0) return NaN;
    return meanExcessReturn / stdDevExcessReturn;
}

// Sortino Ratio: (Portfolio Return - Risk-Free Rate) / Downside Deviation
function calculateSortinoRatio(returns, riskFreeRatePerc, targetReturn = 0) {
    if (!returns || returns.length === 0) return NaN;
    const rf_dec = riskFreeRatePerc / 100; // Convert RF to decimal for calculation
    const excessReturns = returns.map(r => r / 100 - rf_dec); // Convert returns to decimal and subtract RF
    const downsideDeviation = calculateDownsideDeviation(returns.map(r => r / 100), targetReturn / 100); // Convert returns and target to decimal
    if (downsideDeviation === 0) return NaN;
    return calculateMean(excessReturns) / downsideDeviation;
}

// Omega Ratio: (Sum of (Returns - Threshold) for Returns > Threshold) / (Sum of (Threshold - Returns) for Returns <= Threshold)
function calculateOmegaRatio(returns, thresholdPerc = 0) {
    if (!returns || returns.length === 0) return NaN;
    const threshold_dec = thresholdPerc / 100; // Convert threshold to decimal
    const returns_dec = returns.map(r => r / 100); // Convert returns to decimal

    let gains = 0;
    let losses = 0;

    for (const r of returns_dec) {
        if (r > threshold_dec) {
            gains += (r - threshold_dec);
        } else {
            losses += (threshold_dec - r);
        }
    }
    return losses === 0 ? Infinity : gains / losses;
}
