// Global variables and constants
let currentLang = 'fa';
let dataPoints = []; // Array to hold numerical data points
let calculatedResults = {};
let selectedEditIndex = -1;

// --- Translations Dictionary ---
const texts = {
    'app_title': {'en': "Advanced Risk & Return Analyzer", 'fa': "تحلیلگر پیشرفته ریسک و بازده"},
    'status_ready': {'en': "Ready.", 'fa': "آماده."},
    'status_calculating': {'en': "Calculating metrics...", 'fa': "درحال محاسبه معیارها..."},
    'status_calc_done': {'en': "Calculations complete.", 'fa': "محاسبات کامل شد."},
    'status_calc_error': {'en': "Calculation error: {error}", 'fa': "خطا در محاسبات: {error}"},
    'status_plotting_hist': {'en': "Plotting histogram...", 'fa': "درحال رسم هیستوگرام..."},
    'status_plotting_box': {'en': "Plotting box plot...", 'fa': "درحال رسم نمودار جعبه‌ای..."},
    'status_plotting_equity': {'en': "Plotting equity curve...", 'fa': "درحال رسم نمودار ارزش تجمعی..."},
    'status_plotting_qq': {'en': "Plotting QQ plot...", 'fa': "درحال رسم نمودار QQ..."},
    'status_plot_done': {'en': "Plot generated.", 'fa': "نمودار رسم شد."},
    'status_plot_error': {'en': "Error plotting: {error}", 'fa': "خطا در رسم نمودار: {error}"},
    'status_data_added': {'en': "{count} data point(s) added.", 'fa': "{count} داده با موفقیت اضافه شد."},
    'status_data_invalid': {'en': "{count} added. Some invalid entries ignored: {entries}", 'fa': "{count} داده اضافه شد. برخی ورودی‌های نامعتبر نادیده گرفته شد: {entries}"},
    'status_no_valid_data': {'en': "Error: No valid data entered.", 'fa': "خطا: هیچ داده معتبری وارد نشد."},
    'status_empty_input': {'en': "Empty input ignored.", 'fa': "ورودی خالی نادیده گرفته شد."},
    'status_data_edited': {'en': "Data point {index} edited from {old_val}% to {new_val}%."},
    'status_data_deleted': {'en': "Data point {index} ({val}%) deleted."},
    'status_list_cleared': {'en': "Data list cleared."},
    'status_results_reset': {'en': "Results reset. Click 'Calculate' to analyze."},
    'status_saving_results': {'en': "Preparing to save results..."},
    'status_save_success': {'en': "Results saved to '{filename}'."},
    'status_save_cancel': {'en': "Save operation cancelled."},
    'status_save_error': {'en': "Error saving file."},
    'status_import_cancel': {'en': "Import operation cancelled or no file dropped."},
    'status_importing': {'en': "Reading file '{filename}'..."},
    'status_import_success': {'en': "{count} data points imported successfully."},
    'status_import_error': {'en': "Error reading file."},
    'status_import_format_error': {'en': "Error: Invalid file format. Please drop a CSV, Excel, or TXT file."},
    'status_import_no_numeric': {'en': "Error: No numeric column found in the file."},
    'status_import_no_valid': {'en': "Error: No valid numeric data found in the file/column."},
    'status_rf_error': {'en': "Error: Invalid Risk-Free Rate."},
    'status_need_data_calc': {'en': "Insufficient data for calculation (min 2 points)."},
    'status_need_data_plot': {'en': "No data to plot."},
    'status_no_results': {'en': "No results to save."},
    'status_no_data_save': {'en': "No data to save."},
    'status_select_edit': {'en': "Select an item to edit first."},
    'status_select_delete': {'en': "Select an item to delete first."},
    'status_edit_empty': {'en': "New value cannot be empty."},
    'status_edit_invalid': {'en': "Invalid value entered."},
    'status_edit_index_error': {'en': "Error saving data (index error)."},
    'status_delete_index_error': {'en': "Error deleting data (index error)."},
    'results_title': {'en': "Analysis Results:", 'fa': "نتایج تحلیل:"},
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
    'kurtosis_label': {'en': "Excess Kurtosis", 'fa': "کشیدگی اضافی"},
    'normality_label': {'en': "Normality (Shapiro-Wilk)", 'fa': "نرمال بودن (شاپیرو-ویلک)"},
    'var_label': {'en': "Historical VaR 5%", 'fa': "VaR تاریخی ۵٪"},
    'var_95_label': {'en': "Historical Gain 95%", 'fa': "سود تاریخی ۹۵٪"},
    'max_gain_label': {'en': "Max Gain", 'fa': "حداکثر سود"},
    'sharpe_label': {'en': "Sharpe Ratio", 'fa': "نسبت شارپ"},
    'sortino_label': {'en': "Sortino Ratio", 'fa': "نسبت سورتینو"},
    'save_results_button': {'en': "Save Results to Text File", 'fa': "ذخیره نتایج در فایل متنی"},
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
    'data_option_format': {'en': "Data {index} ({value}%)", 'fa': "داده {index} ({value}%)"},

    'mean_tooltip': {
        'en': "**Arithmetic Mean:** The average of all data points. Represents the central tendency of the returns.\n\n*Usefulness:* Provides a simple measure of the typical return over the period. However, it can be skewed by outliers.",
        'fa': "**میانگین حسابی:** میانگین تمام نقاط داده. نشان‌دهنده گرایش مرکزی بازده‌ها است.\n\n*کاربرد:* یک معیار ساده از بازده معمول در طول دوره ارائه می‌دهد. با این حال، ممکن است تحت تأثیر مقادیر پرت قرار گیرد."
    },
    'geo_mean_tooltip': {
        'en': "**Geometric Mean (CAGR):** The average rate of return over multiple periods, assuming profits are reinvested. More accurate for time-series data like investment returns.\n\n*Usefulness:* Reflects the compound growth rate of an investment. Crucial for understanding long-term performance.",
        'fa': "**میانگین هندسی (CAGR):** میانگین نرخ بازده در چندین دوره، با فرض سرمایه‌گذاری مجدد سودها. برای داده‌های سری زمانی مانند بازده سرمایه‌گذاری دقیق‌تر است.\n\n*کاربرد:* نرخ رشد مرکب یک سرمایه‌گذاری را منعکس می‌کند. برای درک عملکرد بلندمدت حیاتی است."
    },
    'std_dev_tooltip': {
        'en': "**Standard Deviation (Total Risk):** Measures the total volatility or dispersion of returns around the mean. Higher values indicate higher risk.\n\n*Usefulness:* Quantifies the overall risk or uncertainty associated with the returns. A key input for many risk-adjusted return metrics.",
        'fa': "**انحراف معیار (ریسک کل):** نوسان یا پراکندگی کل بازده‌ها حول میانگین را اندازه‌گیری می‌کند. مقادیر بالاتر نشان‌دهنده ریسک بالاتر است.\n\n*کاربرد:* ریسک یا عدم قطعیت کلی مرتبط با بازده‌ها را کمی می‌کند. یک ورودی کلیدی برای بسیاری از معیارهای بازده تعدیل‌شده بر اساس ریسک است."
    },
    'downside_dev_tooltip': {
        'en': "**Downside Deviation (Target=0):** Measures volatility of returns below a target return (here, 0%). Focuses only on negative volatility or 'bad' risk.\n\n*Usefulness:* Helps differentiate between 'good' volatility (upside) and 'bad' volatility (downside). Used in Sortino Ratio.",
        'fa': "**انحراف معیار نزولی (هدف=۰):** نوسان بازده‌های کمتر از یک بازده هدف (در اینجا ۰٪) را اندازه‌گیری می‌کند. فقط بر نوسانات منفی یا ریسک 'بد' تمرکز دارد.\n\n*کاربرد:* به تمایز بین نوسان 'خوب' (روند صعودی) و نوسان 'بد' (روند نزولی) کمک می‌کند. در نسبت سورتینو استفاده می‌شود."
    },
    'variance_tooltip': {
        'en': "**Variance:** The square of the standard deviation. Another measure of return dispersion.\n\n*Usefulness:* Similar to standard deviation but expressed in squared units. Less intuitive than standard deviation but mathematically fundamental.",
        'fa': "**واریانس:** مجذور انحراف معیار. معیار دیگری برای پراکندگی بازده است.\n\n*کاربرد:* مشابه انحراف معیار است اما با واحدهای مجذور بیان می‌شود. نسبت به انحراف معیار کمتر قابل درک مستقیم است اما از نظر ریاضی بنیادی است."
    },
    'cv_tooltip': {
        'en': "**Coefficient of Variation (CV):** Standard deviation divided by the absolute mean return. Measures risk per unit of return. Useful for comparing investments with different return levels.\n\n*Usefulness:* Provides a standardized measure of risk relative to return. Higher CV means more risk for each unit of expected return.",
        'fa': "**ضریب تغییرات (CV):** انحراف معیار تقسیم بر قدر مطلق میانگین بازده. ریسک به ازای هر واحد بازده را اندازه‌گیری می‌کند. برای مقایسه سرمایه‌گذاری‌ها با سطوح بازده مختلف مفید است.\n\n*کاربرد:* یک معیار استاندارد شده از ریسک نسبت به بازده ارائه می‌دهد. CV بالاتر به معنای ریسک بیشتر برای هر واحد بازده مورد انتظار است."
    },
    'mdd_tooltip': {
        'en': "**Maximum Drawdown (MDD):** The largest peak-to-trough decline during a specific period. Represents the worst possible loss from a previous high.\n\n*Usefulness:* Indicates the maximum potential loss an investor might have experienced. A key measure of downside risk and resilience.",
        'fa': "**حداکثر افت سرمایه (MDD):** بزرگترین کاهش از اوج تا حضیض در یک دوره خاص. نشان‌دهنده بدترین زیان ممکن از یک سقف قبلی است.\n\n*کاربرد:* حداکثر زیان بالقوه‌ای که یک سرمایه‌گذار ممکن است تجربه کرده باشد را نشان می‌دهد. یک معیار کلیدی برای ریسک نزولی و انعطاف‌پذیری است."
    },
    'mdd_period_tooltip': {
        'en': "**MDD Period (steps):** The number of periods (data points) over which the maximum drawdown occurred, from peak to trough.\n\n*Usefulness:* Shows how long the worst losing streak lasted. Provides context to the MDD magnitude.",
        'fa': "**دوره MDD (تعداد دوره):** تعداد دوره‌ها (نقاط داده) که حداکثر افت سرمایه در طول آن رخ داده است، از اوج تا حضیض.\n\n*کاربرد:* نشان می‌دهد که بدترین دوره زیان‌ده چه مدت طول کشیده است. به بزرگی MDD زمینه می‌بخشد."
    },
    'skewness_tooltip': {
        'en': "**Skewness:** Measures the asymmetry of the return distribution. \nPositive: Tail on the right (more large gains). \nNegative: Tail on the left (more large losses).\nZero: Symmetrical.\n\n*Usefulness:* Indicates the likelihood of extreme positive or negative returns. Investors often prefer positive skewness.",
        'fa': "**چولگی:** عدم تقارن توزیع بازده را اندازه‌گیری می‌کند. \nمثبت: دنباله در سمت راست (سودهای بزرگ بیشتر). \nمنفی: دنباله در سمت چپ (زیان‌های بزرگ بیشتر).\nصفر: متقارن.\n\n*کاربرد:* احتمال بازده‌های شدید مثبت یا منفی را نشان می‌دهد. سرمایه‌گذاران اغلب چولگی مثبت را ترجیح می‌دهند."
    },
    'kurtosis_tooltip': {
        'en': "**Excess Kurtosis:** Measures the 'tailedness' of the distribution. \nPositive (Leptokurtic): Fatter tails, more outliers (extreme events are more likely than normal distribution). \nNegative (Platykurtic): Thinner tails, fewer outliers. \nZero for normal distribution.\n\n*Usefulness:* Indicates the risk of extreme outcomes (fat tails). High kurtosis suggests higher probability of large shocks.",
        'fa': "**کشیدگی اضافی:** 'دنباله‌دار بودن' توزیع را اندازه‌گیری می‌کند. \nمثبت (لپتوکورتیک): دنباله‌های چاق‌تر، مقادیر پرت بیشتر (وقایع شدید محتمل‌تر از توزیع نرمال هستند). \nمنفی (پلاتیکورتیک): دنباله‌های لاغرتر، مقادیر پرت کمتر. \nبرای توزیع نرمال صفر است.\n\n*کاربرد:* ریسک نتایج شدید (دنباله‌های چاق) را نشان می‌دهد. کشیدگی بالا نشان‌دهنده احتمال بیشتر شوک‌های بزرگ است."
    },
    'normality_tooltip': {
        'en': "**Normality (Shapiro-Wilk Test):** This statistical test assesses if the data likely comes from a normally distributed population. (Note: Actual test is not performed in this version; placeholder.)\n\n*Usefulness:* Many financial models assume normality. If data is not normal, model assumptions might be violated.",
        'fa': "**نرمال بودن (آزمون شاپیرو-ویلک):** این آزمون آماری بررسی می‌کند که آیا داده‌ها احتمالاً از یک جامعه با توزیع نرمال آمده‌اند یا خیر. (توجه: آزمون واقعی در این نسخه انجام نمی‌شود؛ صرفاً یک جایگزین است.)\n\n*کاربرد:* بسیاری از مدل‌های مالی نرمال بودن را فرض می‌کنند. اگر داده‌ها نرمال نباشند، ممکن است مفروضات مدل نقض شوند."
    },
    'var_tooltip': {
        'en': "**Historical VaR 5% (Value at Risk):** The maximum loss expected (with 95% confidence) over a single period, based on historical data. E.g., a VaR 5% of -2% means there is a 5% chance of losing 2% or more.\n\n*Usefulness:* Provides an estimate of downside risk in a single number. Widely used in risk management.",
        'fa': "**ارزش در معرض خطر (VaR) ۵٪ تاریخی:** حداکثر زیان مورد انتظار (با اطمینان ۹۵٪) در یک دوره واحد، بر اساس داده‌های تاریخی. به عنوان مثال، VaR ۵٪ برابر با ۲-% به این معنی است که ۵٪ احتمال دارد ۲٪ یا بیشتر زیان کنید.\n\n*کاربرد:* تخمینی از ریسک نزولی را در یک عدد واحد ارائه می‌دهد. به طور گسترده در مدیریت ریسک استفاده می‌شود."
    },
    'var_95_tooltip': {
        'en': "**Historical Gain 95%:** The return that was exceeded 95% of the time historically. Represents a high-probability positive outcome.\n\n*Usefulness:* Shows the level of gain achieved in the vast majority of historical periods. Complements VaR by looking at the positive side.",
        'fa': "**سود تاریخی ۹۵٪:** بازدهی که در ۹۵٪ مواقع تاریخی از آن فراتر رفته است. نشان‌دهنده یک نتیجه مثبت با احتمال بالا است.\n\n*کاربرد:* سطح سودی که در اکثریت قریب به اتفاق دوره‌های تاریخی به دست آمده است را نشان می‌دهد. با نگاه کردن به جنبه مثبت، VaR را تکمیل می‌کند."
    },
    'max_gain_tooltip': {
        'en': "**Maximum Gain:** The single best return observed in the data series.\n\n*Usefulness:* Highlights the highest upside potential experienced historically. Can be an indicator of explosive growth potential, but also of high volatility if combined with large losses.",
        'fa': "**حداکثر سود:** بهترین بازده مشاهده شده در سری داده‌ها.\n\n*کاربرد:* بالاترین پتانسیل رشد تجربه شده در تاریخ را برجسته می‌کند. می‌تواند نشانه‌ای از پتانسیل رشد انفجاری باشد، اما در صورت ترکیب با زیان‌های بزرگ، نشانه‌ای از نوسانات بالا نیز هست."
    },
    'sharpe_tooltip': {
        'en': "**Sharpe Ratio:** (Mean Return - Risk-Free Rate) / Standard Deviation. Measures risk-adjusted return. Higher is better.\n\n*Usefulness:* Indicates how much excess return (above risk-free rate) is generated per unit of total risk (standard deviation). Allows comparison of different investments on a risk-adjusted basis.",
        'fa': "**نسبت شارپ:** (میانگین بازده - نرخ بازده بدون ریسک) / انحراف معیار. بازده تعدیل‌شده بر اساس ریسک را اندازه‌گیری می‌کند. مقدار بالاتر بهتر است.\n\n*کاربرد:* نشان می‌دهد به ازای هر واحد ریسک کل (انحراف معیار) چه مقدار بازده مازاد (بالاتر از نرخ بدون ریسک) تولید می‌شود. امکان مقایسه سرمایه‌گذاری‌های مختلف را بر اساس تعدیل ریسک فراهم می‌کند."
    },
    'sortino_tooltip': {
        'en': "**Sortino Ratio:** (Mean Return - Risk-Free Rate) / Downside Deviation. Similar to Sharpe, but only penalizes for downside volatility. Higher is better.\n\n*Usefulness:* Preferred by some over Sharpe as it doesn't penalize for 'good' (upside) volatility. Focuses on return relative to 'bad' risk.",
        'fa': "**نسبت سورتینو:** (میانگین بازده - نرخ بازده بدون ریسک) / انحراف معیار نزولی. مشابه نسبت شارپ است، اما فقط برای نوسانات نزولی جریمه در نظر می‌گیرد. مقدار بالاتر بهتر است.\n\n*کاربرد:* توسط برخی به نسبت شارپ ترجیح داده می‌شود زیرا برای نوسانات 'خوب' (روند صعودی) جریمه در نظر نمی‌گیرد. بر بازده نسبت به ریسک 'بد' تمرکز دارد."
    },
    'rf_tooltip': {
        'en': "**Risk-Free Rate (% Annually):** The theoretical rate of return of an investment with zero risk (e.g., government bonds). Used as a benchmark for other investments.\n\n*Usefulness:* Essential for calculating risk-adjusted return metrics like Sharpe and Sortino ratios. Represents the opportunity cost of taking on risk.",
        'fa': "**نرخ بازده بدون ریسک (% سالانه):** نرخ بازده نظری یک سرمایه‌گذاری با ریسک صفر (مثلاً اوراق قرضه دولتی). به عنوان معیاری برای سایر سرمایه‌گذاری‌ها استفاده می‌شود.\n\n*کاربرد:* برای محاسبه معیارهای بازده تعدیل‌شده بر اساس ریسک مانند نسبت‌های شارپ و سورتینو ضروری است. هزینه فرصت پذیرش ریسک را نشان می‌دهد."
    },
    'file_select_title': {'en': "Select Data File (CSV or Excel)", 'fa': "انتخاب فایل داده (CSV یا Excel)"},
    'save_results_title': {'en': "Save Analysis Results", 'fa': "ذخیره نتایج تحلیل"},
    'error_title': {'en': "Error", 'fa': "خطا"},
    'warning_title': {'en': "Warning", 'fa': "هشدار"},
    'info_title': {'en': "Information", 'fa': "اطلاعات"},
    'invalid_format_msg': {'en': "Only CSV, Excel, and TXT files are supported.", 'fa': "فقط فایل‌های CSV ،Excel و TXT پشتیبانی می‌شوند."},
    'file_not_found_msg': {'en': "File not found:\n{path}", 'fa': "فایل پیدا نشد:\n{path}"},
    'file_read_error_msg': {'en': "Error reading file:\n{error}", 'fa': "خطایی در هنگام خواندن فایل رخ داد:\n{error}"},
    'file_save_error_msg': {'en': "Error saving file:\n{error}", 'fa': "خطایی در هنگام ذخیره فایل رخ داد:\n{error}"},
    'plot_hist_title': {'en': 'Histogram with VaR and Gain Tails', 'fa': 'هیستوگرام با نواحی VaR و سود'},
    'plot_xlabel': {'en': 'Return (%)', 'fa': 'درصد بازده (%)'},
    'plot_ylabel_hist': {'en': 'Frequency / Density', 'fa': 'فراوانی / چگالی'},
    'plot_kde_label': {'en': 'Density Estimate (KDE)', 'fa': 'تخمین چگالی (KDE)'},
    'plot_mean_label': {'en': 'Mean: {val}', 'fa': 'میانگین: {val}'},
    'plot_median_label': {'en': 'Median: {val}', 'fa': 'میانه: {val}'},
    'plot_norm_label': {'en': 'Normal Fit (μ={mean}, σ={std})', 'fa': 'توزیع نرمال متناظر (μ={mean}, σ={std})'},
    'plot_hist_data_label': {'en': 'Data Frequency', 'fa': 'فراوانی داده‌ها'},
    'plot_var_label': {'en': 'VaR 5% ({val}%)', 'fa': 'VaR ۵٪ ({val}%)'},
    'plot_gain_label': {'en': 'Gain 95% ({val}%)', 'fa': 'سود ۹۵٪ ({val}%)'},
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
    'plot_modal_title': {'en': 'Plot', 'fa': 'نمودار'},
    'plotFailed': {'en': 'Plot generation failed.', 'fa': 'رسم نمودار با خطا مواجه شد.'},
    'enterValidNumbers': {'en': 'Please enter valid numbers.', 'fa': 'لطفاً اعداد معتبر وارد کنید.'},
    'enterData': {'en': 'Please enter some data first.', 'fa': 'لطفاً ابتدا داده وارد کنید.'},
    'clear_list_confirm': {'en': 'Clear Entire List?', 'fa': 'پاک کردن کل لیست؟'},
    'ok_button': {'en': 'OK', 'fa': 'باشه'},
    'confirm_delete_text': {'fa': 'حذف خواهد شد!', 'en': 'will be deleted!'},
    'cancel_button': {'fa': 'لغو', 'en': 'Cancel'},
    'deleted_title': {'fa': 'حذف شد!', 'en': 'Deleted!'},
    'confirm_clear_text': {'fa': 'تمام داده‌ها پاک خواهند شد!', 'en': 'All data will be cleared!'},
    'cleared_title': {'fa': 'پاک شد!', 'en': 'Cleared!'},
    'drop_zone_prompt_dedicated': {'en': 'Drag & Drop your CSV/Excel/TXT file here', 'fa': 'فایل CSV/Excel/TXT خود را اینجا بکشید و رها کنید'},
    'or_divider_text': {'en': 'OR', 'fa': 'یا'},
    'save_results_txt_button': {'en': "Save Results to TXT", 'fa': "ذخیره نتایج به TXT"},
    'save_results_excel_button': {'en': "Save Results to Excel", 'fa': "ذخیره نتایج به Excel"},
    'excel_sheet_results_title': {'en': "Analysis Results", 'fa': "نتایج تحلیل"},
    'excel_sheet_raw_data_title': {'en': "Raw Data", 'fa': "داده‌های خام"},
    'status_saving_txt_success': {'en': "Results saved to TXT file '{filename}'.", 'fa': "نتایج با موفقیت در فایل متنی '{filename}' ذخیره شد."},
    'status_saving_excel_success': {'en': "Results saved to Excel file '{filename}'.", 'fa': "نتایج با موفقیت در فایل اکسل '{filename}' ذخیره شد."}
};

// --- DOM Element Selectors ---
const langSelect = document.getElementById('lang-select');
const valueEntry = document.getElementById('value-entry');
const addButton = document.getElementById('add-button');
const editSelect = document.getElementById('edit-select');
const editValueEntry = document.getElementById('edit-value-entry');
const saveEditButton = document.getElementById('save-edit-button');
const deleteButton = document.getElementById('delete-button');
const rfRateInput = document.getElementById('rf-rate');
const dataDisplay = document.getElementById('data-display');
const clearListButton = document.getElementById('clear-list-button');
const calculateButton = document.getElementById('calculate-button');
const plotHistButton = document.getElementById('plot-hist-button');
const plotBoxButton = document.getElementById('plot-box-button');
const plotEquityButton = document.getElementById('plot-equity-button');
const plotQqButton = document.getElementById('plot-qq-button');
const exportResultsTxtButton = document.getElementById('export-results-txt-button'); // New TXT export button
const exportResultsExcelButton = document.getElementById('export-results-excel-button'); // New Excel export button
const dedicatedFileDropArea = document.getElementById('dedicated-file-drop-area'); // Correct ID
const statusBar = document.getElementById('status-bar');
const resultsDisplayDiv = document.getElementById('results-display');
const plotModal = document.getElementById('plotModal');
const plotModalLabel = document.getElementById('plotModalLabel');
const plotContainer = document.getElementById('plot-container');
const plotModalCloseButton = document.getElementById('plotModalCloseButton');
const fileImporterInput = document.getElementById('file-importer-input'); // Added for hidden file input

// --- Utility Functions ---
function _t(key, args = {}) {
    const langTexts = texts[key];
    let text = key;
    if (langTexts) {
        text = langTexts[currentLang] || langTexts['en'] || key;
    }
    // Ensure args is an object before iterating
    if (args && typeof args === 'object') {
        for (const argKey in args) {
            // Use non-capturing group for curly braces in regex
            const regex = new RegExp(`\\{(?:${argKey})\\}`, 'g');
            text = text.replace(regex, args[argKey]);
        }
    }
    return text;
}


function updateStatus(key, args = {}, type = 'info') {
    const message = _t(key, args);
    statusBar.textContent = message;
    statusBar.className = 'status-bar p-2 rounded text-sm text-center'; // Reset classes
    switch (type) {
        case 'success': statusBar.classList.add('bg-green-500', 'text-white'); break;
        case 'error': statusBar.classList.add('bg-red-500', 'text-white'); break;
        case 'warning': statusBar.classList.add('bg-yellow-500', 'text-black'); break;
        case 'info': default: statusBar.classList.add('bg-dark-card', 'text-dark-text-muted'); break;
    }
    console.log(`Status (${type}):`, message);
}

function updateLanguageUI() {
    currentLang = langSelect.value;
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'fa' ? 'rtl' : 'ltr';
    document.title = _t('app_title'); // Update page title

    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        if (texts[key] && texts[key][currentLang]) {
            el.textContent = _t(key);
        } else if (texts[key] && texts[key]['en']) {
             el.textContent = _t(key); // Fallback to English
        }
    });

    // Update placeholders using data-translate-placeholder attribute
    document.querySelectorAll('[data-translate-placeholder]').forEach(el => {
         const key = el.getAttribute('data-translate-placeholder');
         if(key) el.placeholder = _t(key);
    });


    // The dedicated drop zone prompt is handled by the general [data-translate] update.

    updateEditOptions(); // Re-translate dropdown options
    initializeTooltips(); // Re-initialize custom tooltips if needed
    // SweetAlert tooltips use _t() directly, so they update automatically

    if (Object.keys(calculatedResults).length > 0) {
        updateResultsUI(); // Re-format results with new language
    }
    console.log(`Language changed to: ${currentLang}`);
}


async function processImportedFile(file) {
    if (!file) {
        updateStatus('status_import_cancel', {}, 'warning');
        return;
    }
    updateStatus('status_importing', { filename: file.name }, 'info');

    // Define allowed types and extensions, now including TXT
    const allowedTypes = [
        'text/csv',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel', // .xls
        'text/plain' // .txt
    ];
    const allowedExtensions = /(\.csv|\.xlsx|\.xls|\.txt)$/i;
    const fileNameLower = file.name.toLowerCase();
    const fileType = file.type;

    // Check if either the MIME type or the extension matches
    const isAllowed = allowedTypes.includes(fileType) || allowedExtensions.test(fileNameLower);

    if (!isAllowed) {
        // Use the correct translation key and mention TXT
        const errorMsg = _t('invalid_format_msg');
        Swal.fire({ title: _t('error_title'), html: errorMsg, icon: 'error', confirmButtonText: _t('ok_button') });
        updateStatus('status_import_format_error', {}, 'error'); // Use generic key if message is complex
        return;
    }

    const reader = new FileReader();

    reader.onload = async function(e) {
        try {
            const fileData = e.target.result;
            let importedData = [];

            // Handle TXT file parsing
            if (fileNameLower.endsWith('.txt') || fileType === 'text/plain') {
                console.log("Parsing TXT file...");
                const textContent = new TextDecoder().decode(new Uint8Array(fileData));
                const lines = textContent.split(/\r?\n/); // Split by newline, handle Windows/Unix endings
                lines.forEach((line, index) => {
                    const cleanedLine = line.replace(/%/g, '').trim();
                    if (cleanedLine !== '') { // Ignore empty lines
                        // Handle comma as decimal separator robustly
                        const valueStr = cleanedLine.replace(',', '.');
                        const val = parseFloat(valueStr);
                        if (!isNaN(val) && isFinite(val)) {
                            importedData.push(val);
                        } else {
                            console.warn(`Ignoring invalid number in TXT file (line ${index + 1}): '${line}'`);
                        }
                    }
                });
                console.log(`Found ${importedData.length} valid numbers in TXT.`);
            }
            // Handle CSV/Excel file parsing (existing logic)
            else {
                console.log("Parsing CSV/Excel file...");
                let workbook;
                // Read workbook data
                 if (fileNameLower.endsWith('.csv')) {
                    // Use TextDecoder for potentially better encoding handling with CSV
                    const csvStr = new TextDecoder().decode(new Uint8Array(fileData));
                    workbook = XLSX.read(csvStr, { type: 'string', cellDates: false });
                } else {
                    workbook = XLSX.read(fileData, { type: 'array', cellDates: false });
                }

                if (!workbook || !workbook.SheetNames || workbook.SheetNames.length === 0) {
                     throw new Error("Cannot read workbook structure.");
                }
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                // Use defval: null to represent empty cells explicitly
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: null });

                if (jsonData.length === 0) {
                     throw new Error("Sheet appears to be empty.");
                }

                // Find the first column with predominantly numeric data
                let numericColumnFound = false;
                let targetColumnIndex = -1;
                const numCols = jsonData[0]?.length || 0;
                console.log(`Sheet dimensions: ${jsonData.length} rows, ${numCols} columns`);

                if (numCols > 0) {
                    for (let j = 0; j < numCols; j++) {
                        let numericCount = 0;
                        let potentialData = [];
                        // Check first few rows (e.g., 100) for performance on large files? Or check all? Check all for now.
                        for (let i = 0; i < jsonData.length; i++) {
                             // Check if the cell exists and contains a number directly (SheetJS might parse numbers)
                             if (jsonData[i] && typeof jsonData[i][j] === 'number' && isFinite(jsonData[i][j])) {
                                 numericCount++;
                                 potentialData.push(jsonData[i][j]);
                             }
                             // Check if it's a string that looks like a number (handle %, comma)
                             else if (jsonData[i] && typeof jsonData[i][j] === 'string') {
                                 const cleanedValue = jsonData[i][j].replace(/%/g, '').trim();
                                 if (cleanedValue !== '') {
                                     const value = parseFloat(cleanedValue.replace(',', '.'));
                                     if (!isNaN(value) && isFinite(value)) {
                                         numericCount++;
                                         potentialData.push(value); // Store the parsed value
                                     }
                                 }
                             }
                        }
                        console.log(`Column ${j+1} numeric count: ${numericCount}`);
                        // Heuristic: Choose the first column where >50% of rows are numeric
                        if (numericCount > jsonData.length / 2) {
                            targetColumnIndex = j;
                            numericColumnFound = true;
                            // Extract actual valid numbers from this column
                             importedData = [];
                             for (let i = 0; i < jsonData.length; i++) {
                                 if (jsonData[i] && jsonData[i][targetColumnIndex] !== null && jsonData[i][targetColumnIndex] !== undefined) {
                                     let val;
                                     if(typeof jsonData[i][targetColumnIndex] === 'number' && isFinite(jsonData[i][targetColumnIndex])) {
                                         val = jsonData[i][targetColumnIndex];
                                     } else if (typeof jsonData[i][targetColumnIndex] === 'string') {
                                         const cleanedValue = jsonData[i][targetColumnIndex].replace(/%/g, '').trim();
                                         if(cleanedValue !== '') {
                                             val = parseFloat(cleanedValue.replace(',', '.'));
                                         }
                                     }
                                     if (val !== undefined && !isNaN(val) && isFinite(val)) {
                                         importedData.push(val);
                                     }
                                 }
                            }
                            console.log(`Selected column ${targetColumnIndex + 1}. Found ${importedData.length} numbers.`);
                            break; // Found the first suitable column
                        }
                    }
                }

                // If no predominantly numeric column found, throw error
                if (!numericColumnFound) {
                    throw new Error(_t('status_import_no_numeric'));
                }
            } // End of CSV/Excel else block

            // Process the imported data (common for all file types)
            if (importedData.length > 0) {
                // APPEND data, not replace
                dataPoints.push(...importedData);
                updateDataDisplay();
                updateEditOptions();
                updateActionButtonsState();
                resetResultsDisplay(); // Reset results display as data changed
                updateStatus('status_import_success', { count: importedData.length }, 'success');
            } else {
                // If TXT file had no valid numbers or CSV/Excel column had none
                updateStatus('status_import_no_valid', {}, 'error');
                Swal.fire(_t('error_title'), _t('status_import_no_valid'), 'error');
            }
        } catch (error) {
            console.error("Error processing file:", error);
            Swal.fire({
                title: _t('error_title'),
                text: _t('status_import_error') + `\n${error.message}`,
                icon: 'error',
                confirmButtonText: _t('ok_button')
            });
            updateStatus('status_import_error', { error: error.message }, 'error');
        }
    };

    reader.onerror = function() {
        Swal.fire({
            title: _t('error_title'),
            text: _t('status_import_error'),
            icon: 'error',
            confirmButtonText: _t('ok_button')
        });
        updateStatus('status_import_error', {}, 'error');
    };

    // Read as ArrayBuffer, works for text decoding and SheetJS
    reader.readAsArrayBuffer(file);
}

// --- Drag and Drop Handlers ---
function setupDragAndDrop() {
    if (!dedicatedFileDropArea) {
        console.warn("Dedicated file drop area not found. Drag and drop will not be initialized.");
        return;
    }
    console.log("Setting up drag and drop for:", dedicatedFileDropArea);

    // Click listener to trigger hidden file input
    dedicatedFileDropArea.addEventListener('click', () => {
        if (fileImporterInput) {
            fileImporterInput.click();
        }
    });

    // Listener for file selection via hidden input
    if (fileImporterInput) {
        fileImporterInput.addEventListener('change', async (event) => {
            const files = event.target.files;
            if (files.length > 0) {
                console.log(`File selected via input: ${files[0].name}`);
                await processImportedFile(files[0]);
                // Reset the input value to allow selecting the same file again if needed
                event.target.value = null; 
            } else {
                updateStatus('status_import_cancel', {}, 'warning');
            }
        });
    }

    dedicatedFileDropArea.addEventListener('dragenter', (event) => {
        event.preventDefault();
        dedicatedFileDropArea.classList.add('drag-over-active');
        console.log("Drag Enter");
    });

    dedicatedFileDropArea.addEventListener('dragover', (event) => {
        event.preventDefault(); // Necessary to allow drop
        dedicatedFileDropArea.classList.add('drag-over-active');
        event.dataTransfer.dropEffect = 'copy'; // Show a copy icon
    });

    dedicatedFileDropArea.addEventListener('dragleave', (event) => {
        // Check if the leave is to an element outside the drop zone
        if (!dedicatedFileDropArea.contains(event.relatedTarget)) {
             dedicatedFileDropArea.classList.remove('drag-over-active');
             console.log("Drag Leave");
        }
    });

    dedicatedFileDropArea.addEventListener('drop', async (event) => {
        event.preventDefault();
        dedicatedFileDropArea.classList.remove('drag-over-active');
        console.log("Drop detected");
        const files = event.dataTransfer.files;

        if (files.length > 0) {
            console.log(`File dropped: ${files[0].name}`);
            await processImportedFile(files[0]); // Process the first file
        } else {
            console.log("Drop event with no files.");
            updateStatus('status_import_cancel', {}, 'warning');
        }
    });
}


// --- Core App Functions ---
function formatNumber(value, digits = 2, addPercent = false) {
    if (value === Infinity) return "∞";
    if (value === -Infinity) return "-∞";
    if (typeof value !== 'number' || !isFinite(value)) {
        return _t('na_value'); // Use translated N/A
    }
    // Ensure digits is a non-negative integer
    digits = Math.max(0, Math.floor(digits));

    const locale = currentLang === 'fa' ? 'fa-IR' : 'en-US';
    const options = {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
        // useGrouping: true // Optional: Add grouping separators (commas/etc.)
    };
    let formatted = new Intl.NumberFormat(locale, options).format(value);
    if (addPercent) {
        formatted = currentLang === 'fa' ? `%${formatted}` : `${formatted}%`;
    }
    return formatted;
}

function addDataPoint() {
    const rawInput = valueEntry.value.trim();
    if (!rawInput) {
        updateStatus('status_empty_input', {}, 'info'); // Use 'info' type
        valueEntry.focus();
        return;
    }
    const potentialValues = rawInput.split(/[\s,;\\n\t]+/).filter(val => val); // Use double backslash for newline in regex
    let addedCount = 0;
    const invalidEntries = [];
    const newlyAddedData = [];

    potentialValues.forEach(rawVal => {
        const cleanedValue = rawVal.replace(/%/g, '').trim();
        if (!cleanedValue) return;
        // Handle comma as decimal separator robustly
        const valueStr = cleanedValue.replace(',', '.');
        const value = parseFloat(valueStr);

        if (!isNaN(value) && isFinite(value)) {
            newlyAddedData.push(value);
            addedCount++;
        } else {
            invalidEntries.push(rawVal);
        }
    });

    if (addedCount > 0) {
        // APPEND data, not replace
        dataPoints.push(...newlyAddedData);
        updateDataDisplay();
        updateEditOptions();
        resetResultsDisplay(); // Reset results display as data changed
        updateActionButtonsState();

        let statusKey = 'status_data_added';
        let statusArgs = { count: addedCount };
        let statusType = 'success'; // Default to success

        if (invalidEntries.length > 0) {
            statusKey = 'status_data_invalid';
            const entriesStr = `${invalidEntries.slice(0, 3).join(', ')}${invalidEntries.length > 3 ? '...' : ''}`;
            statusArgs['entries'] = entriesStr;
            statusType = 'warning'; // Change type to warning
            console.warn(_t(statusKey, statusArgs)); // Log the warning
        }
        updateStatus(statusKey, statusArgs, statusType); // Update status with correct type
    } else if (invalidEntries.length > 0) {
        // Only invalid data entered
        Swal.fire(_t('error_title'), _t('status_no_valid_data'), 'error');
        updateStatus('status_no_valid_data', {}, 'error');
    }

    valueEntry.value = ''; // Clear input
    valueEntry.focus();
    updateEditControlsState(); // Update edit controls state in case list was empty
}


function updateDataDisplay() {
    const placeholder = dataDisplay.querySelector('.data-placeholder');
    if (!placeholder) { // Create placeholder if it doesn't exist
        const newPlaceholder = document.createElement('p'); // Use <p> for semantic consistency
        newPlaceholder.className = 'data-placeholder text-center text-dark-text-muted p-4';
        newPlaceholder.setAttribute('data-translate', 'list_empty_option');
        dataDisplay.appendChild(newPlaceholder);
    }
    const actualPlaceholder = dataDisplay.querySelector('.data-placeholder'); // Re-select

    if (dataPoints.length === 0) {
        dataDisplay.innerHTML = ''; // Clear potential old items before adding placeholder
        actualPlaceholder.textContent = _t('list_empty_option');
        actualPlaceholder.style.display = 'block';
        dataDisplay.appendChild(actualPlaceholder); // Ensure placeholder is there
    } else {
        if (actualPlaceholder) actualPlaceholder.style.display = 'none'; // Hide placeholder
        const fragment = document.createDocumentFragment();
        dataPoints.forEach((p, i) => {
            const item = document.createElement('div');
            // Consistent class names with dark theme
            item.className = 'py-1 px-2 border-b border-dark-border last:border-b-0 flex justify-between items-center text-sm';
            // Use translated format number and appropriate text colors
            item.innerHTML = `<span class="text-dark-text-muted mr-2">${formatNumber(i + 1, 0)}.</span> <span class="font-mono text-dark-text">${formatNumber(p, 4)}%</span>`;
            fragment.appendChild(item);
        });
        dataDisplay.innerHTML = ''; // Clear previous content
        dataDisplay.appendChild(fragment);
        // Optional: Scroll to bottom if you want to see the latest added data
        // dataDisplay.scrollTop = dataDisplay.scrollHeight;
    }
    updateActionButtonsState(); // Update buttons based on whether data exists
}

function updateEditOptions() {
    if (!editSelect) return;
    const currentSelectedIndexStr = editSelect.value; // Preserve selection if possible
    // Reset options, ensuring placeholder text is translated
    editSelect.innerHTML = `<option value="" data-translate="select_option">${_t('select_option')}</option>`;

    if (dataPoints.length === 0) {
        // Set placeholder text for empty list, translate it
        editSelect.options[0].textContent = _t('list_empty_option');
        editSelect.options[0].setAttribute('data-translate', 'list_empty_option'); // Keep attribute for lang changes
        editSelect.disabled = true;
    } else {
        dataPoints.forEach((p, i) => {
            const option = document.createElement('option');
            option.value = i.toString();
            // Use translated format for display
            option.textContent = _t('data_option_format', { index: formatNumber(i + 1, 0), value: formatNumber(p, 2) });
            editSelect.appendChild(option);
        });
        // Restore selection if the index still exists
        if (currentSelectedIndexStr !== "" && parseInt(currentSelectedIndexStr) < dataPoints.length) {
            editSelect.value = currentSelectedIndexStr;
            selectedEditIndex = parseInt(currentSelectedIndexStr); // Ensure global state is consistent
        } else {
            selectedEditIndex = -1; // Reset if selection is no longer valid
            editSelect.value = ""; // Ensure dropdown shows placeholder
        }
        editSelect.disabled = false;
    }
    updateEditControlsState(); // Update based on new options/selection
}

function updateEditControlsState() {
    const hasData = dataPoints.length > 0;
    const itemSelected = selectedEditIndex !== -1 && selectedEditIndex < dataPoints.length;

    if (editSelect) editSelect.disabled = !hasData;
    if (editValueEntry) editValueEntry.disabled = !itemSelected;
    if (saveEditButton) saveEditButton.disabled = !itemSelected;
    if (deleteButton) deleteButton.disabled = !itemSelected;

    // Clear edit input if no item is selected
    if (!itemSelected && editValueEntry) editValueEntry.value = "";
}


function loadValueForEditFromMenu(event) {
    selectedEditIndex = event.target.value !== "" ? parseInt(event.target.value, 10) : -1;
     if (selectedEditIndex !== -1 && selectedEditIndex < dataPoints.length) {
        // Use raw number for editing, not formatted string
        editValueEntry.value = dataPoints[selectedEditIndex].toString();
        editValueEntry.focus();
        editValueEntry.select(); // Select text for easy replacement
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
    // Handle comma as decimal separator
    const newVal = parseFloat(newValStr.replace(',', '.'));

    if (isNaN(newVal) || !isFinite(newVal)) {
        Swal.fire(_t('error_title'), _t('status_edit_invalid'), 'error');
        updateStatus('status_edit_invalid', {}, 'error'); return;
    }
    try {
        const oldVal = dataPoints[selectedEditIndex];
        dataPoints[selectedEditIndex] = newVal;
        updateDataDisplay();
        updateEditOptions(); // Update dropdown text with new value
        resetResultsDisplay(); // Reset results as data changed
        updateActionButtonsState();
        updateStatus('status_data_edited', { index: formatNumber(selectedEditIndex + 1, 0), old_val: formatNumber(oldVal, 2), new_val: formatNumber(newVal, 2) }, 'success');
        editValueEntry.focus(); // Keep focus for potential further edits
    } catch (e) {
        console.error("Error saving edited value:", e);
        Swal.fire(_t('error_title'), _t('status_edit_index_error'), 'error');
        updateStatus('status_edit_index_error', {}, 'error');
        selectedEditIndex = -1; // Reset selection on error
        updateEditOptions();
        updateEditControlsState();
    }
}

// --- Functions with added confirmations/logging ---

function deleteSelectedData() {
    if (selectedEditIndex === -1 || selectedEditIndex >= dataPoints.length) {
        Swal.fire(_t('warning_title'), _t('status_select_delete'), 'warning');
        updateStatus('status_select_delete', {}, 'warning'); return;
    }
    // Added confirmation texts
    Swal.fire({
        title: _t('delete_button') + ` داده ${formatNumber(selectedEditIndex + 1, 0)}؟`,
        // Use a dedicated key for the confirmation body text if needed, or construct it
        text: _t('data_option_format', {index: formatNumber(selectedEditIndex+1,0), value: formatNumber(dataPoints[selectedEditIndex], 2)}) + " " + _t('confirm_delete_text'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: _t('delete_button'),
        cancelButtonText: _t('cancel_button'), // Use translated cancel button text
        customClass: { // Ensure SweetAlert styling matches theme
             popup: 'swal2-popup', title: 'swal2-title', htmlContainer: 'swal2-html-container', confirmButton: 'swal2-confirm', cancelButton: 'swal2-cancel', closeButton: 'swal2-close'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            try {
                const deletedVal = dataPoints.splice(selectedEditIndex, 1)[0];
                const deletedIndexHuman = selectedEditIndex + 1; // Store before resetting
                selectedEditIndex = -1; editValueEntry.value = ''; // Reset selection and input
                updateDataDisplay(); updateEditOptions(); resetResultsDisplay(); updateEditControlsState(); updateActionButtonsState();
                updateStatus('status_data_deleted', { index: formatNumber(deletedIndexHuman, 0), val: formatNumber(deletedVal, 2) }, 'success');
                // Show success confirmation
                Swal.fire(_t('deleted_title'), _t('status_data_deleted', { index: formatNumber(deletedIndexHuman, 0), val: formatNumber(deletedVal, 2) }), 'success');
            } catch (e) {
                console.error("Error deleting data:", e);
                Swal.fire(_t('error_title'), _t('status_delete_index_error'), 'error');
                updateStatus('status_delete_index_error', {}, 'error');
                selectedEditIndex = -1; updateEditOptions(); updateEditControlsState(); // Reset state on error
            }
        }
    });
}

function clearDataList() {
    if (dataPoints.length === 0) return; // Do nothing if list is already empty
    // Added confirmation texts
    Swal.fire({
        title: _t('clear_list_confirm'),
        text: _t('confirm_clear_text'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: _t('clear_list_button'), // More specific confirmation text
        cancelButtonText: _t('cancel_button'),
         customClass: { // Ensure SweetAlert styling matches theme
             popup: 'swal2-popup', title: 'swal2-title', htmlContainer: 'swal2-html-container', confirmButton: 'swal2-confirm', cancelButton: 'swal2-cancel', closeButton: 'swal2-close'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            dataPoints = []; calculatedResults = {}; selectedEditIndex = -1;
            updateDataDisplay(); updateEditOptions(); resetResultsDisplay(); updateEditControlsState(); updateActionButtonsState();
            updateStatus('status_list_cleared', {}, 'success');
            valueEntry.focus();
             Swal.fire(_t('cleared_title'), _t('status_list_cleared'), 'success'); // Success notification
        }
    });
}

function resetResultsDisplay() {
    console.log("Resetting results display to N/A."); // Added log
    resultsDisplayDiv.querySelectorAll('span[id^="result-"]').forEach(span => {
        span.textContent = _t('na_value'); // Use translated N/A
        // Reset colors consistently
        span.classList.remove('text-highlight-pos', 'text-highlight-neg', 'text-highlight-neutral', 'text-dark-text');
        span.classList.add('text-dark-text-muted'); // Default muted color
    });
    // Update labels based on current language
    document.querySelectorAll('#results-display strong[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        element.textContent = _t(key);
    });
    // Update data list placeholder text if needed (though updateDataDisplay handles this)
    const placeholder = dataDisplay.querySelector('.data-placeholder');
    if (placeholder && dataPoints.length === 0) {
        placeholder.textContent = _t('list_empty_option');
    }
}

function updateActionButtonsState() {
    const hasData = dataPoints.length > 0;
    const hasEnoughDataForCalc = dataPoints.length >= 2;
    // Check more robustly if results exist and are finite numbers
    const hasResults = calculatedResults && typeof calculatedResults.mean === 'number' && isFinite(calculatedResults.mean);

    if (calculateButton) calculateButton.disabled = !hasEnoughDataForCalc;
    if (plotHistButton) plotHistButton.disabled = !hasData;
    if (plotBoxButton) plotBoxButton.disabled = !hasData;
    if (plotEquityButton) plotEquityButton.disabled = !hasData;
    if (plotQqButton) plotQqButton.disabled = !hasEnoughDataForCalc;
    if (exportResultsTxtButton) exportResultsTxtButton.disabled = !hasResults;
    if (exportResultsExcelButton) exportResultsExcelButton.disabled = !hasResults;
    if (clearListButton) clearListButton.disabled = !hasData;
}


function calculateMetrics() {
    console.log("Attempting to calculate metrics..."); // Log start
    if (dataPoints.length < 2) {
        // Use Swal for consistency
        Swal.fire(_t('warning_title'), _t('status_need_data_calc'), 'warning');
        updateStatus('status_need_data_calc', {}, 'warning');
        resetResultsDisplay(); // Reset display but show count
        // Ensure result-count is updated even with insufficient data
        const countSpan = document.getElementById('result-count');
        if (countSpan) countSpan.textContent = formatNumber(dataPoints.length, 0);
        updateActionButtonsState(); // Disable buttons appropriately
        return;
    }

    updateStatus('status_calculating', {}, 'info');
    calculatedResults = {}; // Reset before calculation

    try {
        // --- Risk-Free Rate ---
        const rfStr = rfRateInput.value.trim().replace(/%/g, '');
        const rfRaw = parseFloat(rfStr.replace(',', '.')) || 0.0; // Default to 0
        if (isNaN(rfRaw) || !isFinite(rfRaw)) {
            Swal.fire(_t('error_title'), _t('status_rf_error'), 'error');
            updateStatus('status_rf_error', {}, 'error');
            rfRateInput.focus(); rfRateInput.select();
            resetResultsDisplay(); // Reset on RF error too
            updateActionButtonsState();
            return;
        }
        const rf = rfRaw;
        calculatedResults['rf'] = rf;

        // --- Filter Data & Check Count ---
        const data = dataPoints.filter(p => isFinite(p));
        const n = data.length;
        calculatedResults['n'] = n;
        calculatedResults['data'] = data; // Store the exact data used
        console.log(`Filtered data points for calculation: ${n}`);

        if (n < 2) {
            Swal.fire(_t('warning_title'), _t('status_need_data_calc'), 'warning');
            updateStatus('status_need_data_calc', {}, 'warning');
            resetResultsDisplay();
            document.getElementById('result-count').textContent = formatNumber(n, 0); // Show filtered count
            updateActionButtonsState();
            return;
        }

        // --- Perform Calculations ---
        // Ensure helpers return NaN on failure which formatNumber handles
        calculatedResults['mean'] = calculateMean(data);
        calculatedResults['std'] = calculateStdDev(data);
        calculatedResults['var'] = (calculatedResults.std !== null && !isNaN(calculatedResults.std)) ? Math.pow(calculatedResults.std, 2) : NaN;
        calculatedResults['median'] = calculatePercentile(data, 50); // Stored for potential use (plots)
        calculatedResults['gm'] = calculateGeometricMean(data);
        calculatedResults['dsd'] = calculateDownsideDeviation(data, 0);
        calculatedResults['cv'] = (calculatedResults.mean !== null && !isNaN(calculatedResults.mean) && Math.abs(calculatedResults.mean) > 1e-9 && calculatedResults.std !== null && !isNaN(calculatedResults.std)) ? calculatedResults.std / Math.abs(calculatedResults.mean) : NaN; // Use abs(mean) for CV
        const mddResult = calculateMaxDrawdown(data);
        calculatedResults['mdd'] = mddResult.maxDrawdown;
        calculatedResults['mdd_period'] = mddResult.duration;
        let sk = NaN, ku = NaN;
        if (typeof ss !== 'undefined') {
            if (n >= 3 && !isNaN(calculatedResults.std) && calculatedResults.std > 1e-9) {
                try { sk = ss.sampleSkewness(data); } catch (e) { console.warn("Skewness calc failed:", e); }
                try { ku = ss.sampleKurtosis(data); } catch (e) { console.warn("Kurtosis calc failed:", e); }
            } else if (n > 0 && (!isNaN(calculatedResults.std) && calculatedResults.std <= 1e-9)) {
                sk = 0.0; // Data has no variation
                ku = -3.0; // Kurtosis of constant data is -3 for excess kurtosis
            }
        } else { console.warn("simple-statistics library (ss) not loaded."); }
        calculatedResults['skew'] = sk;
        calculatedResults['kurt'] = ku;
        calculatedResults['var5'] = calculatePercentile(data, 5);
        calculatedResults['var95'] = calculatePercentile(data, 95);
        calculatedResults['max_gain'] = (n > 0) ? Math.max(...data) : NaN;
        calculatedResults['sh'] = (calculatedResults.std !== null && !isNaN(calculatedResults.std) && Math.abs(calculatedResults.std) > 1e-9 && calculatedResults.mean !== null && !isNaN(calculatedResults.mean)) ? (calculatedResults.mean - rf) / calculatedResults.std : NaN;
        let sortino = NaN;
        if (calculatedResults.dsd !== null && !isNaN(calculatedResults.dsd) && calculatedResults.mean !== null && !isNaN(calculatedResults.mean)) {
            if (Math.abs(calculatedResults.dsd) > 1e-9) {
                 sortino = (calculatedResults.mean - rf) / calculatedResults.dsd;
            } else if (calculatedResults.dsd === 0) { // Handle zero downside deviation
                 sortino = (calculatedResults.mean - rf > 1e-9) ? Infinity : ((calculatedResults.mean - rf < -1e-9) ? -Infinity : 0);
            }
        }
        calculatedResults['so'] = sortino;

        console.log("Calculations complete. Results:", calculatedResults); // Log results object

        // --- Update UI ---
        updateResultsUI();
        updateActionButtonsState(); // Enable relevant buttons
        updateStatus('status_calc_done', {}, 'success');

    } catch (error) {
        console.error("Error during calculation:", error);
        Swal.fire(_t('error_title'), _t('status_calc_error', { error: error.message }), 'error');
        updateStatus('status_calc_error', { error: error.message }, 'error');
        resetResultsDisplay(); // Ensure results are reset on error
        updateActionButtonsState();
    }
}


function updateResultsUI() {
    console.log("Updating results UI with:", calculatedResults); // Log before update
    const results = calculatedResults;
    // Check if results object is populated enough
    if (!results || typeof results.n !== 'number') {
        console.warn("updateResultsUI called but calculatedResults seems empty or invalid.");
        resetResultsDisplay(); // Ensure display is reset if results are bad
        return;
    }

    const formatOpt = (digits, percent) => ({ digits: digits, addPercent: percent });

    // Helper to update span text and color class
    const updateSpan = (id, value, options, highlight = 'neutral') => {
        const span = document.getElementById(id);
        if (span) {
            const formattedValue = formatNumber(value, options?.digits, options?.addPercent);
            span.textContent = formattedValue;
            // Reset color classes first
            span.classList.remove('text-dark-text-muted', 'text-highlight-pos', 'text-highlight-neg', 'text-highlight-neutral', 'text-dark-text');

            // Apply highlight color based on value or metric type only if not N/A
            if (formattedValue !== _t('na_value')) {
                 if (highlight === 'pos' && value > 0) span.classList.add('text-highlight-pos');
                 else if (highlight === 'neg' && value < 0) span.classList.add('text-highlight-neg');
                 else if (highlight === 'neutral') span.classList.add('text-highlight-neutral');
                 else if (highlight === 'posneg') span.classList.add(value >= 0 ? 'text-highlight-pos' : 'text-highlight-neg');
                 else span.classList.add('text-dark-text'); // Default non-muted text if no specific highlight
            } else {
                span.classList.add('text-dark-text-muted'); // Muted text for N/A
            }
        } else {
            console.warn(`Result span not found: ${id}`);
        }
    };

    // Apply updates with appropriate highlighting logic
    updateSpan('result-count', results.n, formatOpt(0, false), null); // No highlight
    updateSpan('result-mean', results.mean, formatOpt(2, true), 'posneg');
    updateSpan('result-gm', results.gm, formatOpt(2, true), 'posneg');
    updateSpan('result-std', results.std, formatOpt(2, true), 'neutral'); // Risk metric -> neutral highlight
    updateSpan('result-dsd', results.dsd, formatOpt(2, true), 'neutral'); // Risk metric -> neutral highlight
    updateSpan('result-var', results.var, formatOpt(4, false), null); // Variance, less direct interpretation for color
    updateSpan('result-cv', results.cv, formatOpt(3, false), 'neutral'); // Risk metric -> neutral highlight
    updateSpan('result-mdd', results.mdd, formatOpt(2, true), 'neg'); // Always negative or zero -> neg highlight
    updateSpan('result-mdd-period', results.mdd_period, formatOpt(0, false), null);
    updateSpan('result-skew', results.skew, formatOpt(3, false), 'posneg'); // Can be pos or neg
    updateSpan('result-kurt', results.kurt, formatOpt(3, false), 'neutral'); // Higher kurtosis often seen as risk -> neutral
    // Normality result span is intentionally left N/A
    const normSpan = document.getElementById('result-normality'); if (normSpan) {normSpan.textContent = _t('na_value'); normSpan.className = 'font-mono text-dark-text-muted';} // Ensure N/A style
    updateSpan('result-var5', results.var5, formatOpt(2, true), 'neg'); // VaR is a loss -> neg highlight
    updateSpan('result-var95', results.var95, formatOpt(2, true), 'pos'); // Gain value -> pos highlight
    updateSpan('result-max-gain', results.max_gain, formatOpt(2, true), 'pos');
    updateSpan('result-sharpe', results.sh, formatOpt(3, false), 'neutral'); // Higher is better, neutral color ok
    updateSpan('result-sortino', results.so, formatOpt(3, false), 'neutral'); // Higher is better
}


// --- Plotting ---
// Plotting constants (DARK_... , PRIMARY_...) remain the same
const DARK_BACKGROUND_COLOR = '#111827';
const DARK_CARD_COLOR = '#1f2937';
const DARK_TEXT_COLOR = '#d1d5db';
const DARK_MUTED_COLOR = '#9ca3af';
const DARK_BORDER_COLOR = '#374151';
const PRIMARY_COLOR = '#3b82f6';
const ACCENT_COLOR_NEG = '#f87171';
const ACCENT_COLOR_POS = '#34d399';
const ACCENT_COLOR_MEAN = '#fbbf24';
const ACCENT_COLOR_MEDIAN = '#60a5fa';
const ACCENT_COLOR_FIT = '#a78bfa';
const ACCENT_COLOR_KDE = '#14b8a6';
const ACCENT_COLOR_EQUITY = '#22c55e';


function plotActionWrapper(plotFunc, titleKey) {
    console.log(`Plot action triggered for: ${titleKey}`);
    if (dataPoints.length === 0) {
        Swal.fire(_t('warning_title'), _t('status_need_data_plot'), 'warning');
        updateStatus('status_need_data_plot', {}, 'warning'); return;
    }
    // Ensure calculations are up-to-date before plotting
    const currentFiniteData = dataPoints.filter(p => isFinite(p));
    // Check if results exist OR if the data length used for calculation matches current data length
    if (Object.keys(calculatedResults).length === 0 || !calculatedResults.data || calculatedResults.n !== currentFiniteData.length) {
        console.log("Results are missing or data changed, recalculating before plotting...");
        // Check if enough data for the specific plot *before* calculating
        const minPoints = (titleKey === 'plot_qq_title' ? 2 : 1);
         if (currentFiniteData.length < minPoints) {
             const msgKey = (minPoints === 2) ? 'status_need_data_calc' : 'status_need_data_plot';
             Swal.fire(_t('warning_title'), _t(msgKey), 'warning');
             updateStatus(msgKey, {}, 'warning');
             return;
         }
        // calculateMetrics will handle its own checks and UI updates if it fails
        calculateMetrics();
        // Crucially, check if calculation *succeeded* and produced results
        if (!calculatedResults.data || calculatedResults.data.length < (titleKey === 'plot_qq_title' ? 2 : 1)) {
             console.log("Plot cancelled: metric calculation failed or resulted in insufficient valid data.");
             // Swal/status messages already shown by calculateMetrics if it failed internally
             return; // Stop plotting
         }
    }

    const dataToPlot = calculatedResults.data; // Use data stored after calculation
    // Final check for the specific plot requirements
    if (!dataToPlot || dataToPlot.length === 0 || (titleKey === 'plot_qq_title' && dataToPlot.length < 2)) {
         Swal.fire(_t('warning_title'), _t('status_need_data_plot'), 'warning');
         updateStatus('status_need_data_plot', {}, 'warning');
         return;
     }

    const statusMap = {
        plotHistogramLogic: 'status_plotting_hist',
        plotBoxplotLogic: 'status_plotting_box',
        plotEquityCurveLogic: 'status_plotting_equity',
        plotQqplotLogic: 'status_plotting_qq'
    };
    updateStatus(statusMap[plotFunc.name] || 'status_plotting_hist', {}, 'info');

    try {
        console.log("Generating plot data and layout...");
        const { plotData, layout } = plotFunc(dataToPlot); // Pass the calculated data
        if (!plotData || !layout) throw new Error(_t('plotFailed'));

        layout.autosize = true; // Ensure responsiveness

        const currentPlotTitleElement = document.getElementById('plotModalLabel');
        if (currentPlotTitleElement) currentPlotTitleElement.textContent = _t(titleKey);
        else console.error("Plot modal title element ('plotModalLabel') not found!");

        if (plotContainer) { try { Plotly.purge(plotContainer); } catch(e) { console.warn("Minor error purging plot:", e); }}
        else { console.error("Plot container not found!"); throw new Error("Plot container missing."); }

        const config = {
            responsive: true,
            displaylogo: false,
            modeBarButtonsToRemove: ['sendDataToCloud', 'editInChartStudio', 'lasso2d', 'select2d'],
            toImageButtonOptions: {
                 filename: (_t(titleKey).replace(/[^a-zA-Z0-9_\.\-]/g, '_') || 'plot_export'),
                 scale: 1 // Use 1 for default resolution, increase for higher res
            }
        };

        console.log("Rendering plot with Plotly...");
        Plotly.newPlot(plotContainer, plotData, layout, config).then(() => {
            console.log("Plot rendered successfully.");
            // Show the modal AFTER plot is rendered
            if (plotModal) {
                 // Ensure listeners are attached only once per modal opening
                 window.removeEventListener('keydown', escapeKeyHandler);
                 plotModal.removeEventListener('click', backdropClickHandler);
                 plotModal.addEventListener('click', backdropClickHandler);
                 window.addEventListener('keydown', escapeKeyHandler);

                 plotModal.classList.remove('hidden');
                 plotModal.classList.add('flex'); // Use flex for centering
                 document.body.style.overflow = 'hidden'; // Prevent background scroll
            }
            updateStatus('status_plot_done', {}, 'success');
        }).catch(renderError => {
             console.error("Plotly rendering Error:", renderError);
             throw new Error(`Plotly rendering failed: ${renderError.message}`);
        });

    } catch (error) {
        console.error("Plotting Error:", error);
        Swal.fire(_t('error_title'), _t('status_plot_error', { error: error.message }), 'error');
        updateStatus('status_plot_error', { error: error.message }, 'error');
        // Ensure modal is hidden on error
         if(plotModal) {
             plotModal.classList.add('hidden');
             plotModal.classList.remove('flex');
         }
         document.body.style.overflow = 'auto'; // Restore scroll on error
    }
}

// --- Plotting Logic Functions (Keep implementations as before) ---
function plotHistogramLogic(data) { /* ... (Implementation as before) ... */
    const n = data.length;
    const mean = calculatedResults.mean ?? NaN; const median = calculatedResults.median ?? NaN;
    const std = calculatedResults.std ?? NaN; const var_5 = calculatedResults.var5 ?? NaN;
    const var_95 = calculatedResults.var95 ?? NaN;
    const traceHist = { x: data, type: 'histogram', name: _t('plot_hist_data_label'), marker: { color: PRIMARY_COLOR, line: { color: DARK_CARD_COLOR, width: 0.5 }}, histnorm: 'probability density', autobinx: false, nbinsx: Math.min(35, Math.ceil(n/2)+1), hovertemplate: `${_t('plot_xlabel')}: %{x:.2f}%<br>${_t('plot_ylabel_hist')}: %{y:.4f}<extra></extra>` };
    const plotData = [traceHist];
    if (n > 1 && !isNaN(mean) && !isNaN(std) && std > 1e-9) {
        const xMin = Math.min(...data); const xMax = Math.max(...data); const range = xMax - xMin;
        const xNorm = []; const yNormPDF = []; const step = range / 100 || 0.1;
        const startX = isFinite(xMin) ? xMin - range * 0.1 : mean - 3*std; const endX = isFinite(xMax) ? xMax + range * 0.1 : mean + 3*std;
        for (let x = startX; x <= endX; x += step) { xNorm.push(x); yNormPDF.push((1 / (std * Math.sqrt(2 * Math.PI))) * Math.exp(-Math.pow(x - mean, 2) / (2 * Math.pow(std, 2)))); }
        plotData.push({ x: xNorm, y: yNormPDF, type: 'scatter', mode: 'lines', name: _t('plot_norm_label', { mean: formatNumber(mean, 1), std: formatNumber(std, 1) }), line: { color: ACCENT_COLOR_FIT, dash: 'dashdot', width: 1.5 }, hovertemplate: `%{name}<br>${_t('plot_xlabel')}: %{x:.2f}%<br>Density: %{y:.4f}<extra></extra>` });
    } else { traceHist.histnorm = ''; traceHist.nbinsx = Math.min(25, Math.ceil(n/2)+1); traceHist.hovertemplate = `${_t('plot_xlabel')}: %{x}<br>Frequency: %{y}<extra></extra>`; }
    if (n > 1 && typeof ss !== 'undefined' && typeof ss.kernelDensityEstimation === 'function') {
        try { const kdePoints = ss.kernelDensityEstimation(data, 'gaussian', 'silverman'); const xKde = kdePoints.map(p => p[0]); const yKde = kdePoints.map(p => p[1]); if (xKde.length > 0 && yKde.length > 0) plotData.push({ x: xKde, y: yKde, type: 'scatter', mode: 'lines', name: _t('plot_kde_label'), line: { color: ACCENT_COLOR_KDE, width: 1.8, dash: 'solid' }, hovertemplate: `${_t('plot_kde_label')}<br>${_t('plot_xlabel')}: %{x:.2f}%<br>Density: %{y:.4f}<extra></extra>` }); } catch (kdeError) { console.warn("Error calculating KDE:", kdeError); }
    }
    const layout = { title: _t('plot_hist_title'), xaxis: { title: _t('plot_xlabel'), color: DARK_TEXT_COLOR, gridcolor: DARK_BORDER_COLOR, zerolinecolor: DARK_MUTED_COLOR, zeroline: true, tickformat: ',.1f' }, yaxis: { title: _t(traceHist.histnorm === 'probability density' ? 'plot_ylabel_hist' : 'Frequency'), color: DARK_TEXT_COLOR, gridcolor: DARK_BORDER_COLOR, zerolinecolor: DARK_MUTED_COLOR, zeroline: true, showgrid: true }, plot_bgcolor: DARK_CARD_COLOR, paper_bgcolor: DARK_BACKGROUND_COLOR, font: { color: DARK_TEXT_COLOR, family: 'Vazirmatn, sans-serif' }, legend: { bgcolor: 'rgba(31, 41, 55, 0.8)', bordercolor: DARK_BORDER_COLOR, borderwidth: 1, x: 0.02, y: 0.98, font: { color: DARK_TEXT_COLOR }}, bargap: 0.05, shapes: [], margin: { l: 60, r: 30, t: 50, b: 50 }};
    const addLine = (xVal, color, nameKey, args = {}, dash = 'dash') => { if (!isNaN(xVal) && isFinite(xVal)) { const lineName = _t(nameKey, args); layout.shapes.push({ type: 'line', x0: xVal, y0: 0, x1: xVal, y1: 1, yref: 'paper', line: { color: color, width: 2, dash: dash }}); plotData.push({ x: [null], y: [null], mode: 'lines', line: { color: color, width: 2, dash: dash }, name: lineName, hovertemplate: `%{name}<extra></extra>` });}};
    addLine(mean, ACCENT_COLOR_MEAN, 'plot_mean_label', { val: formatNumber(mean, 2) }, 'solid'); addLine(median, ACCENT_COLOR_MEDIAN, 'plot_median_label', { val: formatNumber(median, 2) }, 'dashdot'); addLine(var_5, ACCENT_COLOR_NEG, 'plot_var_label', { val: formatNumber(var_5, 2) }, 'dot'); addLine(var_95, ACCENT_COLOR_POS, 'plot_gain_label', { val: formatNumber(var_95, 2) }, 'dot');
    return { plotData, layout };
}

function plotBoxplotLogic(data) { /* ... (Implementation as before) ... */
    const traceBox = { y: data, type: 'box', name: ' ', boxpoints: 'all', jitter: 0.4, pointpos: 0, marker: { color: PRIMARY_COLOR, size: 4, opacity: 0.7, line: { color: DARK_BORDER_COLOR, width: 0.5 }}, line: { color: DARK_TEXT_COLOR }, fillcolor: 'rgba(59, 130, 246, 0.3)', hoverinfo: 'all', hoverlabel: { bgcolor: DARK_BACKGROUND_COLOR, bordercolor: PRIMARY_COLOR, font: { color: DARK_TEXT_COLOR, family: 'Vazirmatn, sans-serif' }}, boxmean: 'sd' };
    const plotData = [traceBox];
    const layout = { title: _t('plot_box_title'), yaxis: { title: _t('plot_ylabel_box'), color: DARK_TEXT_COLOR, gridcolor: DARK_BORDER_COLOR, zerolinecolor: DARK_MUTED_COLOR, zeroline: true, showgrid: true, tickformat: ',.1f' }, xaxis: { showticklabels: false, zeroline: false, showgrid: false }, plot_bgcolor: DARK_CARD_COLOR, paper_bgcolor: DARK_BACKGROUND_COLOR, font: { color: DARK_TEXT_COLOR, family: 'Vazirmatn, sans-serif' }, showlegend: false, margin: { l: 60, r: 30, t: 50, b: 30 }};
    return { plotData, layout };
}

function plotEquityCurveLogic(data) { /* ... (Implementation as before) ... */
    const initialValue = 1000; const equityCurve = [initialValue]; let currentValue = initialValue;
    data.forEach(returnPerc => { currentValue *= (1 + (isFinite(returnPerc) ? returnPerc : 0) / 100.0); equityCurve.push(currentValue); });
    const indices = Array.from({ length: equityCurve.length }, (_, i) => i);
    const traceEquity = { x: indices, y: equityCurve, type: 'scatter', mode: 'lines', name: _t('plot_equity_title'), line: { color: ACCENT_COLOR_EQUITY, width: 1.8 }, hovertemplate: `${_t('plot_equity_xlabel')}: %{x}<br>${_t('plot_equity_ylabel')}: %{y:,.0f}<extra></extra>` };
    const plotData = [traceEquity];
    const layout = { title: _t('plot_equity_title'), xaxis: { title: _t('plot_equity_xlabel'), color: DARK_TEXT_COLOR, gridcolor: DARK_BORDER_COLOR, zerolinecolor: DARK_MUTED_COLOR, showgrid: true, zeroline: false }, yaxis: { title: _t('plot_equity_ylabel'), color: DARK_TEXT_COLOR, gridcolor: DARK_BORDER_COLOR, zerolinecolor: DARK_MUTED_COLOR, zeroline: false, showgrid: true, tickformat: ',.0f' }, plot_bgcolor: DARK_CARD_COLOR, paper_bgcolor: DARK_BACKGROUND_COLOR, font: { color: DARK_TEXT_COLOR, family: 'Vazirmatn, sans-serif' }, showlegend: false, shapes: [{ type: 'line', x0: 0, y0: initialValue, x1: indices.length - 1, y1: initialValue, xref: 'x', yref: 'y', line: { color: DARK_MUTED_COLOR, width: 1, dash: 'dot' }}], margin: { l: 70, r: 30, t: 50, b: 50 }};
    return { plotData, layout };
}

function plotQqplotLogic(data) { /* ... (Implementation as before) ... */
    if (data.length < 2) throw new Error("QQ Plot requires at least 2 data points.");
    if (typeof ss === 'undefined' || typeof ss.probit !== 'function') { console.error("ss.probit not available."); throw new Error("ss.probit missing."); }
    const sortedData = [...data].sort((a, b) => a - b); const n = sortedData.length; const theoreticalQuantiles = [];
    for (let i = 0; i < n; i++) { const rank = (i + 1 - 3/8) / (n + 1/4); const safeRank = Math.max(1e-9, Math.min(1 - 1e-9, rank)); try { theoreticalQuantiles.push(ss.probit(safeRank)); } catch (probitError) { console.warn(`ss.probit failed for rank ${safeRank}`, probitError); theoreticalQuantiles.push(NaN); }}
    const validPairs = theoreticalQuantiles.map((q, i) => ({ theo: q, sample: sortedData[i] })).filter(pair => isFinite(pair.theo) && isFinite(pair.sample));
    if (validPairs.length < 2) { console.warn("Not enough valid quantile pairs."); throw new Error("Insufficient valid quantiles."); }
    const validTheoreticalQuantiles = validPairs.map(p => p.theo); const validSortedData = validPairs.map(p => p.sample);
    const traceScatter = { x: validTheoreticalQuantiles, y: validSortedData, mode: 'markers', type: 'scatter', name: 'Data Quantiles', marker: { color: PRIMARY_COLOR, size: 5, opacity: 0.8, line: { color: DARK_BORDER_COLOR, width: 0.5 }}, hovertemplate: `${_t('plot_qq_xlabel')}: %{x:.2f}<br>${_t('plot_qq_ylabel')}: %{y:.2f}%<extra></extra>` };
    const sampleMean = calculatedResults.mean ?? calculateMean(validSortedData); const sampleStd = calculatedResults.std ?? calculateStdDev(validSortedData);
    const lineX = []; const lineY = [];
    if (!isNaN(sampleMean) && !isNaN(sampleStd) && sampleStd > 1e-9) { const minTheoQuantile = Math.min(...validTheoreticalQuantiles); const maxTheoQuantile = Math.max(...validTheoreticalQuantiles); lineX.push(minTheoQuantile, maxTheoQuantile); lineY.push(sampleMean + minTheoQuantile * sampleStd, sampleMean + maxTheoQuantile * sampleStd); }
    else { console.warn("Cannot draw QQ reference line due to invalid mean/std."); }
    const traceLine = { x: lineX, y: lineY, mode: 'lines', type: 'scatter', name: 'Normal Reference Line', line: { color: ACCENT_COLOR_NEG, width: 1.5, dash: 'dash' }, hovertemplate: `%{name}<extra></extra>` };
    const plotData = [traceScatter]; if (lineX.length > 0) plotData.push(traceLine);
    const layout = { title: _t('plot_qq_title'), xaxis: { title: _t('plot_qq_xlabel'), color: DARK_TEXT_COLOR, gridcolor: DARK_BORDER_COLOR, zerolinecolor: DARK_MUTED_COLOR, zeroline: true, showgrid: true, tickformat: '.2f' }, yaxis: { title: _t('plot_qq_ylabel'), color: DARK_TEXT_COLOR, gridcolor: DARK_BORDER_COLOR, zerolinecolor: DARK_MUTED_COLOR, zeroline: true, showgrid: true, tickformat: ',.1f' }, plot_bgcolor: DARK_CARD_COLOR, paper_bgcolor: DARK_BACKGROUND_COLOR, font: { color: DARK_TEXT_COLOR, family: 'Vazirmatn, sans-serif' }, showlegend: false, hovermode: 'closest', margin: { l: 60, r: 30, t: 50, b: 50 }};
    return { plotData, layout };
}


// --- File Export ---
function exportResultsToTxtFile() { // Renamed function
    if (!calculatedResults || typeof calculatedResults.n !== 'number') { // Check if results exist
        Swal.fire(_t('warning_title'), _t('status_no_results'), 'warning');
        updateStatus('status_no_results', {}, 'warning'); return;
    }
    updateStatus('status_saving_results', {}, 'info');
    const lines = [];
    const results = calculatedResults;
    const inputData = dataPoints; // Export original data points
    const now = new Date();
    const locale = currentLang === 'fa' ? 'fa-IR' : 'en-US';
    const dateTimeFormat = new Intl.DateTimeFormat(locale, { dateStyle: 'short', timeStyle: 'medium' });

    try {
        lines.push(`========== ${_t('app_title')} ==========`);
        lines.push(`${_t('data_count')}: ${formatNumber(results.n, 0)}`); // Show calculated N
        lines.push(`Date: ${dateTimeFormat.format(now)}`);
        lines.push(`Risk-Free Rate: ${formatNumber(results.rf, 2, true)}`);
        lines.push("-".repeat(50));
        lines.push(_t('results_title'));
        lines.push("-".repeat(50));

        const getResultLine = (labelKey, resultKey, options) => `${_t(labelKey)}: ${formatNumber(results[resultKey], options?.digits, options?.addPercent)}`;

        lines.push(getResultLine('mean_label', 'mean', {digits:2, addPercent:true}));
        lines.push(getResultLine('geo_mean_label', 'gm', {digits:2, addPercent:true}));
        lines.push(getResultLine('std_dev_label', 'std', {digits:2, addPercent:true}));
        lines.push(getResultLine('downside_dev_label', 'dsd', {digits:2, addPercent:true}));
        lines.push(getResultLine('variance_label', 'var', {digits:4, addPercent:false}));
        lines.push(getResultLine('cv_label', 'cv', {digits:3, addPercent:false}));
        lines.push(getResultLine('mdd_label', 'mdd', {digits:2, addPercent:true}));
        lines.push(getResultLine('mdd_period_label', 'mdd_period', {digits:0, addPercent:false}));
        lines.push(getResultLine('skewness_label', 'skew', {digits:3, addPercent:false}));
        lines.push(getResultLine('kurtosis_label', 'kurt', {digits:3, addPercent:false}));
        lines.push(`${_t('normality_label')}: ${_t('na_value')} (Calculation Removed)`);
        lines.push(getResultLine('var_label', 'var5', {digits:2, addPercent:true}));
        lines.push(getResultLine('var_95_label', 'var95', {digits:2, addPercent:true}));
        lines.push(getResultLine('max_gain_label', 'max_gain', {digits:2, addPercent:true}));
        lines.push(getResultLine('sharpe_label', 'sh', {digits:3, addPercent:false}));
        lines.push(getResultLine('sortino_label', 'so', {digits:3, addPercent:false}));

        lines.push("\n" + "=".repeat(50));
        lines.push(`Input Data (${inputData.length} points):`); // Use original length
        lines.push("-".repeat(50));
        lines.push(...inputData.map((p, i) => `${formatNumber(i + 1, 0)}. ${formatNumber(p, 4)}%`));
        lines.push("=".repeat(50));

        const outputText = lines.join('\n');
        const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
        const dateStr = now.toISOString().slice(0, 10);
        const filename = `RiskAnalysisResults_${dateStr}.txt`;

        downloadBlob(blob, filename);
        updateStatus('status_saving_txt_success', { filename: filename }, 'success'); // Use new status key

    } catch (error) {
        console.error("Error exporting results to TXT:", error);
        Swal.fire(_t('error_title'), _t('file_save_error_msg', { error: error.message }), 'error');
        updateStatus('status_save_error', {}, 'error');
    }
}

function exportResultsToExcelFile() {
    if (!calculatedResults || typeof calculatedResults.n !== 'number') {
        Swal.fire(_t('warning_title'), _t('status_no_results'), 'warning');
        updateStatus('status_no_results', {}, 'warning'); return;
    }
    updateStatus('status_saving_results', {}, 'info'); // Generic saving status
    const results = calculatedResults;
    const inputData = dataPoints;
    const now = new Date();
    const locale = currentLang === 'fa' ? 'fa-IR' : 'en-US';
    const dateTimeFormat = new Intl.DateTimeFormat(locale, { dateStyle: 'short', timeStyle: 'medium' });

    try {
        // --- Create Raw Data Sheet --- (Sheet 1)
        // Header for raw data
        const rawDataSheetData = [[_t('col_return')]]; // Header row
        inputData.forEach(point => {
            rawDataSheetData.push([point]); // Push each data point as a new row in the first column
        });
        const rawDataWorksheet = XLSX.utils.aoa_to_sheet(rawDataSheetData);

        // --- Create Results Summary Sheet --- (Sheet 2)
        const resultsSheetData = [];
        resultsSheetData.push([_t('app_title')]);
        resultsSheetData.push([`${_t('data_count')}:`, formatNumber(results.n, 0)]);
        resultsSheetData.push([_t('Date', {skipTranslation: true, defaultValue: 'Date'}) + ':', dateTimeFormat.format(now)]); // Using a helper to avoid 'Date' being translated if not present
        resultsSheetData.push([`${_t('rf_title')}:`, formatNumber(results.rf, 2, true)]);
        resultsSheetData.push([]); // Empty row for spacing

        const addResultRow = (labelKey, value) => {
            resultsSheetData.push([_t(labelKey), value]);
        };

        addResultRow('mean_label', formatNumber(results.mean, 2, true));
        addResultRow('geo_mean_label', formatNumber(results.gm, 2, true));
        addResultRow('std_dev_label', formatNumber(results.std, 2, true));
        addResultRow('downside_dev_label', formatNumber(results.dsd, 2, true));
        addResultRow('variance_label', formatNumber(results.var, 4, false));
        addResultRow('cv_label', formatNumber(results.cv, 3, false));
        addResultRow('mdd_label', formatNumber(results.mdd, 2, true));
        addResultRow('mdd_period_label', formatNumber(results.mdd_period, 0, false));
        addResultRow('skewness_label', formatNumber(results.skew, 3, false));
        addResultRow('kurtosis_label', formatNumber(results.kurt, 3, false));
        addResultRow('normality_label', `${_t('na_value')} (Calculation Removed)`);
        addResultRow('var_label', formatNumber(results.var5, 2, true));
        addResultRow('var_95_label', formatNumber(results.var95, 2, true));
        addResultRow('max_gain_label', formatNumber(results.max_gain, 2, true));
        addResultRow('sharpe_label', formatNumber(results.sh, 3, false));
        addResultRow('sortino_label', formatNumber(results.so, 3, false));
        
        const resultsWorksheet = XLSX.utils.aoa_to_sheet(resultsSheetData);

        // --- Create Workbook and Download ---
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, rawDataWorksheet, _t('excel_sheet_raw_data_title'));
        XLSX.utils.book_append_sheet(workbook, resultsWorksheet, _t('excel_sheet_results_title'));

        const dateStr = now.toISOString().slice(0, 10);
        const filename = `RiskAnalysisResults_${dateStr}.xlsx`;
        XLSX.writeFile(workbook, filename);

        updateStatus('status_saving_excel_success', { filename: filename }, 'success');

    } catch (error) {
        console.error("Error exporting results to Excel:", error);
        Swal.fire(_t('error_title'), _t('file_save_error_msg', { error: error.message }), 'error');
        updateStatus('status_save_error', {}, 'error');
    }
}

function downloadBlob(blob, filename) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}


// --- Tooltip & Modal Handlers ---
// Keep implementations as provided in the previous corrected version
function initializeTooltips() { /* ... */
    document.body.removeEventListener('mouseover', handleTooltipMouseover); document.body.removeEventListener('mouseout', handleTooltipMouseout);
    document.body.removeEventListener('focusin', handleTooltipMouseover); document.body.removeEventListener('focusout', handleTooltipMouseout);
    document.body.addEventListener('mouseover', handleTooltipMouseover); document.body.addEventListener('mouseout', handleTooltipMouseout);
    document.body.addEventListener('focusin', handleTooltipMouseover); document.body.addEventListener('focusout', handleTooltipMouseout);
}
function handleTooltipMouseover(event) { /* ... */
    const icon = event.target.closest('.tooltip-icon'); if (!icon) return;
    const tooltipKey = icon.getAttribute('data-tooltip-key'); if (!tooltipKey) return;
    const tooltipText = _t(tooltipKey); if (!tooltipText) return;
    let tooltipElement = document.getElementById('dynamic-tooltip');
    if (!tooltipElement) { tooltipElement = document.createElement('div'); tooltipElement.id = 'dynamic-tooltip'; tooltipElement.className = 'tooltip-popup absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm dark:bg-gray-700 whitespace-nowrap pointer-events-none'; tooltipElement.setAttribute('role', 'tooltip'); document.body.appendChild(tooltipElement); }
    tooltipElement.innerHTML = tooltipText.replace(/\n/g, '<br>'); tooltipElement.style.display = 'block';
    const rect = icon.getBoundingClientRect(); const tooltipRect = tooltipElement.getBoundingClientRect();
    let top = rect.top + window.scrollY - tooltipRect.height - 8; let left = rect.left + window.scrollX + (rect.width / 2) - (tooltipRect.offsetWidth / 2);
    if (top < window.scrollY + 5) top = rect.bottom + window.scrollY + 8; if (left < window.scrollX + 5) left = window.scrollX + 5; if (left + tooltipRect.width > document.documentElement.clientWidth + window.scrollX - 5) left = document.documentElement.clientWidth + window.scrollX - tooltipRect.width - 5;
    tooltipElement.style.top = `${Math.max(0, top)}px`; tooltipElement.style.left = `${Math.max(0, left)}px`;
}
function handleTooltipMouseout(event) { /* ... */
     const icon = event.target.closest('.tooltip-icon');
     if (icon || (event.relatedTarget && event.relatedTarget.closest && event.relatedTarget.closest('.tooltip-icon'))) return;
     const tooltipElement = document.getElementById('dynamic-tooltip');
     if (tooltipElement) tooltipElement.style.display = 'none';
}
function initializeSweetAlertTooltips() { /* ... */
    document.body.removeEventListener('click', handleTooltipIconClick); document.body.addEventListener('click', handleTooltipIconClick);
}
function handleTooltipIconClick(event) { /* ... */
    const icon = event.target.closest('.tooltip-icon'); if (!icon) return; event.preventDefault();
    const tooltipKey = icon.getAttribute('data-tooltip-key'); if (!tooltipKey) return; const tooltipText = _t(tooltipKey); if (!tooltipText) return;
    Swal.fire({ title: `<strong class="text-lg font-semibold">${_t('info_title')}</strong>`, html: `<div class="text-sm text-left rtl:text-right leading-relaxed">${tooltipText.replace(/\n/g, '<br>')}</div>`, icon: 'info', confirmButtonText: _t('ok_button'), customClass: { popup: 'swal2-popup', title: 'swal2-title', htmlContainer: 'swal2-html-container', confirmButton: 'swal2-confirm', closeButton: 'swal2-close' }, showCloseButton: true });
}
function closeModal() { /* ... */
    if (plotModal) { plotModal.classList.add('hidden'); plotModal.classList.remove('flex'); } document.body.style.overflow = 'auto';
    if (plotContainer) { try { Plotly.purge(plotContainer); } catch (e) { console.error("Error purging plot:", e); }}
    window.removeEventListener('keydown', escapeKeyHandler); if(plotModal) plotModal.removeEventListener('click', backdropClickHandler);
}
function closeModalHandler() { closeModal(); }
function backdropClickHandler(event) { if (event.target === plotModal) closeModal(); }
function escapeKeyHandler(event) { if (event.key === 'Escape') closeModal(); }


// --- Calculation Helpers ---
// Keep implementations as provided in the previous corrected version
function calculateMean(data) { if (!data || data.length === 0) return NaN; const sum = data.reduce((acc, val) => acc + val, 0); return sum / data.length; }
function calculateStdDev(data) { if (!data || data.length < 2) return NaN; const mean = calculateMean(data); if (isNaN(mean)) return NaN; const variance = data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (data.length - 1); return Math.sqrt(variance); }
function calculatePercentile(data, percentile) { if (!data || data.length === 0 || percentile < 0 || percentile > 100) return NaN; const sortedData = [...data].sort((a, b) => a - b); const n = sortedData.length; if (percentile === 0) return sortedData[0]; if (percentile === 100) return sortedData[n - 1]; const index = (percentile / 100) * (n - 1); const lowerIndex = Math.floor(index); const upperIndex = Math.ceil(index); const weight = index - lowerIndex; if (lowerIndex === upperIndex) return sortedData[lowerIndex]; else { const lowerValue = sortedData[lowerIndex] ?? sortedData[0]; const upperValue = sortedData[upperIndex] ?? sortedData[n-1]; return lowerValue * (1 - weight) + upperValue * weight; }}
function calculateGeometricMean(data) { if (!data || data.length === 0) return NaN; let product = 1.0; for (const p of data) { const growthFactor = 1 + p / 100.0; if (growthFactor <= 1e-9) return NaN; product *= growthFactor; } if (product < 0) return NaN; return (Math.pow(product, 1.0 / data.length) - 1.0) * 100.0; }
function calculateDownsideDeviation(data, target = 0) { if (!data || data.length < 2) return NaN; const n = data.length; const downsideReturns = data.filter(r => r < target); if (downsideReturns.length === 0) return 0.0; const sumSqDev = downsideReturns.reduce((acc, r) => acc + Math.pow(r - target, 2), 0); return Math.sqrt(sumSqDev / (n - 1)); }
function calculateMaxDrawdown(returnsPerc) { if (!returnsPerc || returnsPerc.length === 0) return { maxDrawdown: 0.0, duration: 0, peakIndex: 0, troughIndex: 0 }; const dataArr = returnsPerc.filter(p => isFinite(p)); if (dataArr.length === 0) return { maxDrawdown: 0.0, duration: 0, peakIndex: 0, troughIndex: 0 }; let cumulative = [1.0]; dataArr.forEach(r => { cumulative.push(cumulative[cumulative.length - 1] * (1 + r / 100.0)); }); let maxDd = 0.0; let peakIndex = 0; let troughIndex = 0; let currentPeakValue = cumulative[0]; let currentPeakIndex = 0; for (let i = 1; i < cumulative.length; i++) { if (cumulative[i] > currentPeakValue) { currentPeakValue = cumulative[i]; currentPeakIndex = i; } else { const currentDrawdown = (currentPeakValue <= 1e-9) ? 0 : (cumulative[i] / currentPeakValue - 1.0) * 100.0; if (currentDrawdown < maxDd) { maxDd = currentDrawdown; peakIndex = currentPeakIndex; troughIndex = i; }}} const duration = troughIndex - peakIndex; return { maxDrawdown: isFinite(maxDd) ? maxDd : 0.0, duration: isFinite(duration) ? duration : 0, peakIndex: peakIndex, troughIndex: troughIndex };}


// --- Event Listeners & Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed");
    // Initialize language first
    const savedLang = localStorage.getItem('preferredLang');
    if (savedLang && langSelect) { // Check if langSelect exists
        langSelect.value = savedLang;
    }
    currentLang = langSelect ? langSelect.value : 'fa'; // Default to 'fa' if select fails
    updateLanguageUI(); // Apply initial language

    // --- Attach Event Listeners ---
    if (langSelect) {
        langSelect.addEventListener('change', () => {
            localStorage.setItem('preferredLang', langSelect.value);
            updateLanguageUI();
        });
    }

    if (addButton) {
         addButton.addEventListener('click', addDataPoint);
    } else { console.error("Add button not found"); }

    if (valueEntry) {
        // Use keydown for Enter detection
        valueEntry.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && !event.shiftKey) { // Only Enter, not Shift+Enter
                event.preventDefault(); // Prevent newline
                addDataPoint();
            }
        });
     } else { console.error("Value entry textarea not found"); }


    if (editSelect) {
        editSelect.addEventListener('change', loadValueForEditFromMenu);
    } else { console.error("Edit select dropdown not found"); }

    if (saveEditButton) {
        saveEditButton.addEventListener('click', saveEditedValue);
    } else { console.error("Save edit button not found"); }

    if (editValueEntry) {
        // Add keydown listener for Enter key in edit input
         editValueEntry.addEventListener('keydown', (event) => {
             if (event.key === 'Enter') {
                 event.preventDefault(); // Prevent potential form submission
                 saveEditedValue();
             }
         });
    } else { console.error("Edit value entry input not found"); }

    if (deleteButton) {
        deleteButton.addEventListener('click', deleteSelectedData);
    } else { console.error("Delete button not found"); }

    if (clearListButton) {
        clearListButton.addEventListener('click', clearDataList);
    } else { console.error("Clear list button not found"); }

    if (calculateButton) {
        calculateButton.addEventListener('click', calculateMetrics);
    } else { console.error("Calculate button not found"); }

    // Plotting buttons
    const plotButtons = [
        { id: 'plot-hist-button', func: plotHistogramLogic, titleKey: 'plot_hist_title' },
        { id: 'plot-box-button', func: plotBoxplotLogic, titleKey: 'plot_box_title' },
        { id: 'plot-equity-button', func: plotEquityCurveLogic, titleKey: 'plot_equity_title' },
        { id: 'plot-qq-button', func: plotQqplotLogic, titleKey: 'plot_qq_title' }
    ];
    plotButtons.forEach(btnInfo => {
        const button = document.getElementById(btnInfo.id);
        if (button) {
            button.addEventListener('click', () => plotActionWrapper(btnInfo.func, btnInfo.titleKey));
        } else { console.warn(`Plot button ${btnInfo.id} not found.`); } // Warn instead of error
    });

    if(exportResultsTxtButton) {
        exportResultsTxtButton.addEventListener('click', exportResultsToTxtFile); // Updated to new function name
    } else { console.error("Export TXT results button not found"); } 

    const exportExcelButton = document.getElementById('export-results-excel-button');
    if(exportExcelButton) {
        exportExcelButton.addEventListener('click', exportResultsToExcelFile);
    } else { console.error("Export Excel results button not found"); }


    // --- Initialize UI State & Other Setup ---
    updateEditControlsState(); // Initialize enabled/disabled state
    updateActionButtonsState(); // Initialize enabled/disabled state
    resetResultsDisplay(); // Clear results panel on load
    updateStatus('status_ready', {}, 'info'); // Set initial status
    initializeTooltips(); // For hover tooltips
    initializeSweetAlertTooltips(); // For click tooltips (info icons)
    setupDragAndDrop(); // Setup drag and drop for the dedicated area

    // Modal close listeners
    if (plotModalCloseButton) {
        plotModalCloseButton.addEventListener('click', closeModalHandler);
    } else { console.warn("Plot modal close button not found."); }
    if (plotModal) {
        plotModal.addEventListener('click', backdropClickHandler);
    } else { console.warn("Plot modal element not found."); }
    document.addEventListener('keydown', escapeKeyHandler); // Global listener for Esc key

    console.log("Application initialized.");
});

// Ensure dropdown is populated on load (or after data clear)
updateEditOptions();
console.log("script.js loaded and initialized.");