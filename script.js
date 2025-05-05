// Global variables and constants
let currentLang = 'fa';
let dataPoints = []; // Array to hold numerical data points
let calculatedResults = {};
let selectedEditIndex = -1;
let plotModalInstance = null; // Not used with current Tailwind modal approach

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
    'status_plotting_qq': {'en': "Plotting QQ plot...", 'fa': "درحال رسم نمودار QQ..."}, // Added QQ plot status
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
    'geo_mean_label': {'en': "Geometric Mean (CAGR)", 'fa': "میانگین هندسی (CAGR)"},
    'std_dev_label': {'en': "Standard Deviation (Risk)", 'fa': "انحراف معیار (ریسک)"},
    'downside_dev_label': {'en': "Downside Deviation (Target=0)", 'fa': "انحراف معیار نزولی (هدف=۰)"},
    'variance_label': {'en': "Variance", 'fa': "واریانس"},
    'cv_label': {'en': "Coefficient of Variation (CV)", 'fa': "ضریب تغییرات (CV)"},
    'mdd_label': {'en': "Max Drawdown (MDD)", 'fa': "حداکثر افت سرمایه (MDD)"},
    'mdd_period_label': {'en': "MDD Period (steps)", 'fa': "دوره MDD (تعداد دوره)"},
    'skewness_label': {'en': "Skewness", 'fa': "چولگی"},
    'kurtosis_label': {'en': "Excess Kurtosis", 'fa': "کشیدگی اضافی"},
    'normality_label': {'en': "Normality (Shapiro-Wilk)", 'fa': "نرمال بودن (شاپیرو-ویلک)"}, // Key kept, but calculation removed
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
    'data_option_format': {'en': "Data {index} ({value}%)", 'fa': "داده {index} ({value}%)"}, // Simplified format
    // Tooltips
    'mean_tooltip': {'en': "Arithmetic Mean: Simple average of returns.", 'fa': "میانگین حسابی: میانگین ساده بازده‌ها."},
    'geo_mean_tooltip': {'en': "Geometric Mean (CAGR): Compound average rate of return.\nMore accurate for long-term performance.", 'fa': "میانگین هندسی (CAGR): نرخ بازده متوسط ترکیبی.\nمناسب برای عملکرد بلندمدت."},
    'std_dev_tooltip': {'en': "Standard Deviation: Dispersion of returns around the mean (Total Risk).\nHigher value = more volatility/risk.", 'fa': "انحراف معیار: پراکندگی بازده‌ها حول میانگین (ریسک کل).\nمقدار بالاتر = نوسان و ریسک بیشتر."},
    'downside_dev_tooltip': {'en': "Downside Deviation (Target=0): Dispersion of returns below zero.\nMeasures unfavorable volatility (Loss Risk).", 'fa': "انحراف معیار نزولی (هدف=۰): پراکندگی بازده‌های زیر صفر.\nمعیاری از ریسک نامطلوب (ریسک زیان)."},
    'variance_tooltip': {'en': "Variance: Average squared deviation from the mean.\nPrimary unit of dispersion. Variance = Std Dev^2.", 'fa': "واریانس: میانگین مجذور انحرافات از میانگین.\nواحد اصلی پراکندگی."},
    'cv_tooltip': {'en': "Coefficient of Variation (CV): Risk per unit of return (StdDev / Mean).\nUseful for comparing risk of assets with different returns. Lower is better.", 'fa': "ضریب تغییرات (CV): ریسک به ازای واحد بازده.\nبرای مقایسه ریسک دارایی‌ها با بازده متفاوت. پایین‌تر بهتر است."},
    'mdd_tooltip': {'en': "Maximum Drawdown: Largest peak-to-trough percentage decline\nin cumulative returns. Measures downside risk.", 'fa': "حداکثر افت سرمایه: بزرگترین افت درصدی از قله قبلی\nدر بازده تجمعی. ریسک افت شدید را می‌سنجد."},
    'mdd_period_tooltip': {'en': "MDD Period: Duration (in number of data points/periods)\nof the maximum drawdown, from peak to recovery (or end).", 'fa': "دوره MDD: طول دوره (تعداد نقاط داده)\nحداکثر افت سرمایه، از قله تا بازیابی (یا انتها)."},
    'skewness_tooltip': {'en': "Skewness: Asymmetry of the distribution.\nNegative: Longer left tail (large losses more likely).\nPositive: Longer right tail (large gains more likely).\nZero: Symmetric (like Normal).", 'fa': "چولگی: عدم تقارن توزیع.\nمنفی: دم بلندتر چپ (زیان‌های بزرگ محتمل‌تر).\nمثبت: دم بلندتر راست (سودهای بزرگ محتمل‌تر).\nصفر: متقارن."},
    'kurtosis_tooltip': {'en': "Excess Kurtosis: Fatness of the distribution's tails relative to Normal (Kurtosis - 3).\nPositive: Fatter tails, higher probability of extreme values (Tail Risk).", 'fa': "کشیدگی اضافی: چاقی دم‌های توزیع نسبت به نرمال.\nمثبت: دم‌های چاق‌تر، احتمال مقادیر حدی بیشتر (ریسک دم)."},
    'normality_tooltip': {'en': "Shapiro-Wilk Normality Test: (Calculation removed)\nTests if data significantly deviates from a normal distribution.", 'fa': "(محاسبه حذف شد)\nآزمون نرمال بودن شاپیرو-ویلک: آزمون می‌کند آیا داده‌ها به طور معناداری از توزیع نرمال انحراف دارند یا خیر."},
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
    'plot_kde_label': {'en': 'Density Estimate (KDE)', 'fa': 'تخمین چگالی (KDE)'}, // Kept for reference, but KDE not implemented
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
    'plotFailed': {'en': 'Plot generation failed.', 'fa': 'رسم نمودار با خطا مواجه شد.'}, // Added generic plot fail message
    'enterValidNumbers': {'en': 'Please enter valid numbers.', 'fa': 'لطفاً اعداد معتبر وارد کنید.'},
    'enterData': {'en': 'Please enter some data first.', 'fa': 'لطفاً ابتدا داده وارد کنید.'},
    'clear_list_confirm': {'en': 'Clear Entire List?', 'fa': 'پاک کردن کل لیست؟'} // Confirmation text
};

// --- DOM Element Selectors --- commonly used elements
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
const exportResultsButton = document.getElementById('export-results-button');
const importFileLabel = document.querySelector('label[for="import-file"]');
const importFileInput = document.getElementById('import-file');
const exportDataButton = document.getElementById('export-data-button');
const statusBar = document.getElementById('status-bar');
const resultsDisplayDiv = document.getElementById('results-display');
const plotModal = document.getElementById('plotModal');
const plotTitle = document.getElementById('plotTitle'); // Changed from plotModalLabel
const plotContainer = document.getElementById('plotContainer'); // Changed from plot-container
const plotModalCloseButton = document.getElementById('plotModalCloseButton'); // Added explicit ID for close button

// --- Utility Functions ---

/**
 * Gets the translated string for a given key and language.
 * @param {string} key - The translation key.
 * @param {object} [args={}] - Arguments for placeholder replacement.
 * @returns {string} The translated string or the key itself if not found.
 */
function _t(key, args = {}) {
    const langTexts = texts[key];
    let text = key; // Default to key if not found
    if (langTexts) {
        text = langTexts[currentLang] || langTexts['en'] || key;
    }
    // Replace placeholders like {count}
    for (const argKey in args) {
        const regex = new RegExp(`\\{${argKey}\\}`, 'g');
        text = text.replace(regex, args[argKey]);
    }
    return text;
}

/**
 * Updates the status bar text.
 * @param {string} key - The translation key for the status message.
 * @param {object} [args={}] - Arguments for placeholder replacement.
 */
function updateStatus(key, args = {}) {
    if (statusBar) {
        const message = _t(key, args);
        statusBar.textContent = message;
        // Optional: Add visual cue for errors/success?
        if (key.includes('error') || key.includes('invalid')) {
            statusBar.classList.remove('text-green-500');
            statusBar.classList.add('text-red-500');
        } else if (key.includes('success') || key.includes('done') || key.includes('added')) {
            statusBar.classList.remove('text-red-500');
            statusBar.classList.add('text-green-500');
        } else {
            statusBar.classList.remove('text-red-500', 'text-green-500');
        }
        // Keep the key on the element for potential re-translation if needed
        statusBar.setAttribute('data-translate', key);
        statusBar.setAttribute('data-translate-args', JSON.stringify(args)); // Store args too
    }
}

/**
 * Updates UI elements based on the current language.
 */
function updateLanguageUI() {
    console.log("updateLanguageUI called for lang:", currentLang);
    const dir = currentLang === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', currentLang);
    document.title = _t('app_title'); // Update page title

    // Update elements with data-translate attribute
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (key) {
            const argsAttr = element.getAttribute('data-translate-args');
            let args = {};
            if (argsAttr) {
                try { args = JSON.parse(argsAttr); } catch (e) { console.error("Error parsing args for", key, e); }
            }
            const translatedText = _t(key, args);

            // Special handling for different elements
            if (element.tagName === 'BUTTON' || element.tagName === 'LABEL' || element.tagName === 'H2' || element.tagName === 'H3' || element.tagName === 'P' || element.tagName === 'OPTION' || element.tagName === 'SPAN') {
                 // Replace only the first text node if possible, preserving icons
                 let replaced = false;
                 for (let i = 0; i < element.childNodes.length; i++) {
                     if (element.childNodes[i].nodeType === Node.TEXT_NODE && element.childNodes[i].nodeValue.trim()) {
                         element.childNodes[i].nodeValue = translatedText;
                         replaced = true;
                         break;
                     }
                 }
                 // Fallback: set textContent if no text node found or if it's simpler
                 if (!replaced || element.tagName === 'OPTION') {
                     element.textContent = translatedText;
                 }
            } else if (element.id === 'results-title') { // Specific ID for results heading
                element.textContent = translatedText;
            } else if (element.closest('#results-display') && element.tagName === 'STRONG') {
                element.textContent = translatedText; // Update result labels directly
            } else if (element.tagName === 'DIV' && element.classList.contains('data-placeholder')){
                element.textContent = translatedText; // Update data list placeholder
            }
             // Add other specific element handling if needed
        }
    });

    // Update elements with data-translate-placeholder attribute
    document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        if (key) {
            element.placeholder = _t(key);
        }
    });

    // Update elements with data-tooltip attribute (directly)
    document.querySelectorAll('[data-tooltip]').forEach(element => {
        const key = element.getAttribute('data-tooltip');
        // Assuming the key itself is stored in data-tooltip
        if (texts[key]) { // Check if it's a valid key
            const translatedTooltip = _t(key);
            // No direct update needed here, handled by tooltip display functions
        }
    });

    // Update display of data list items and edit dropdown options
    updateDataDisplay();
    updateEditOptions();
    resetResultsDisplay(); // Also updates result labels
}


/**
 * Formats a number to a specific number of decimal places, returning N/A for non-finite values.
 * Uses Intl.NumberFormat for locale-aware formatting (e.g., decimal/thousands separators).
 * @param {number} value - The number to format.
 * @param {number} [digits=2] - The number of decimal places.
 * @param {boolean} [addPercent=false] - Whether to add a percentage sign.
 * @returns {string} The formatted string.
 */
function formatNumber(value, digits = 2, addPercent = false) {
    if (value === Infinity) return "∞";
    if (value === -Infinity) return "-∞";
    if (typeof value !== 'number' || !isFinite(value)) {
        return _t('na_value');
    }

    const locale = currentLang === 'fa' ? 'fa-IR' : 'en-US';
    const options = {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits
    };

    let formatted = new Intl.NumberFormat(locale, options).format(value);

    // Intl doesn't add % sign directly, append manually based on locale
    if (addPercent) {
        formatted = currentLang === 'fa' ? `%${formatted}` : `${formatted}%`;
    }
    return formatted;
}

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed");

    // Set initial language from global variable or default
    langSelect.value = currentLang;
    updateLanguageUI(); // Apply initial language
    updateStatus('status_ready');
    resetResultsDisplay();
    updateDataDisplay();
    updateEditControlsState();
    updateActionButtonsState();
    initializeTooltips(); // *** Initialize tooltips AFTER initial UI setup ***

    // --- Event Listeners ---
    langSelect.addEventListener('change', (e) => {
        console.log("Language select changed!");
        currentLang = e.target.value;
        console.log(`Language changed to: ${currentLang}`);
        updateLanguageUI(); // Update all UI texts, etc.
        updateStatus('status_ready');
        initializeTooltips(); // Re-initialize tooltips for potentially new elements/text
    });

    // Add data listener (Button Click)
    if (addButton) {
    addButton.addEventListener('click', addDataPoint);
    } else { console.error("Add button element not found."); }

    // Add data listener (Textarea Enter Key)
    if (valueEntry) {
        valueEntry.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
            addDataPoint();
        }
    });
    } else { console.error("Value entry textarea element not found."); }

    // Clear list listener
    clearListButton.addEventListener('click', clearDataList);

    // Edit listeners
    editSelect.addEventListener('change', loadValueForEditFromMenu);
    saveEditButton.addEventListener('click', saveEditedValue);
    deleteButton.addEventListener('click', deleteSelectedData);
    editValueEntry.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveEditedValue();
        }
    });

    // Calculate listener
    calculateButton.addEventListener('click', calculateMetrics);

    // Plot listeners using the wrapper
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
        } else { console.error(`Plot button element not found: ${btnInfo.id}`); }
    });

    // Import/Export listeners
    if (importFileLabel) importFileLabel.addEventListener('click', () => importFileInput.click());
    if (importFileInput) importFileInput.addEventListener('change', importDataFromFile);
    if (exportResultsButton) exportResultsButton.addEventListener('click', exportResultsToTxt);
    if (exportDataButton) exportDataButton.addEventListener('click', exportDataToExcel);

    // Plot Modal Close listeners (handled inside plotActionWrapper)

    // Window Resize Listener for Plotly
    let resizeTimer;
    window.addEventListener('resize', () => {
        if (plotModal && !plotModal.classList.contains('hidden')) {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                console.log("Resizing plot...");
                try {
                    if (plotContainer && plotContainer.data) { // Check if plot exists
                         Plotly.Plots.resize(plotContainer);
                    }
                } catch (e) {
                    console.error("Error resizing plot:", e);
                }
            }, 250);
        }
    });

    console.log("Event listeners attached.");
});

// --- Core Functions ---

/**
 * Parses input, validates numbers, adds to dataPoints, updates UI.
 */
function addDataPoint() {
    console.log("addDataPoint called");
    const rawInput = valueEntry.value.trim();
    if (!rawInput) {
        updateStatus('status_empty_input');
        valueEntry.focus();
        return;
    }

    // Split by common delimiters, handle potential percentage signs
    const potentialValues = rawInput.split(/[\s,;\n\t]+/).filter(val => val);
    let addedCount = 0;
    const invalidEntries = [];
    const newlyAddedData = [];

    potentialValues.forEach(rawVal => {
        const cleanedValue = rawVal.replace(/%/g, '').trim();
        if (!cleanedValue) return; // Skip empty

        // Support both dot and comma as decimal separators for input flexibility
        const value = parseFloat(cleanedValue.replace(',', '.'));

        if (!isNaN(value) && isFinite(value)) {
            newlyAddedData.push(value);
            addedCount++;
        } else {
            invalidEntries.push(rawVal);
        }
    });

    if (addedCount > 0) {
        dataPoints.push(...newlyAddedData);
        updateDataDisplay();
        updateEditOptions();
        resetResultsDisplay();
        updateActionButtonsState();

        let statusKey = 'status_data_added';
        let statusArgs = { count: addedCount };

        if (invalidEntries.length > 0) {
            statusKey = 'status_data_invalid';
            const entriesStr = `${invalidEntries.slice(0, 3).join(', ')}${invalidEntries.length > 3 ? '...' : ''}`;
            statusArgs['entries'] = entriesStr;
            // Consider a less intrusive notification than alert
            console.warn(_t(statusKey, statusArgs));
        }
        updateStatus(statusKey, statusArgs);
        initializeTooltips(); // Re-initialize in case new tooltips were added indirectly
    } else if (invalidEntries.length > 0) {
        // Alert or status update about invalid data
        alert(_t('status_no_valid_data'));
        updateStatus('status_no_valid_data');
    }

    valueEntry.value = ''; // Clear input
    valueEntry.focus();
    updateEditControlsState(); // Update edit controls state
}


/**
 * Updates the data list display area.
 */
function updateDataDisplay() {
    console.log("Updating data display");
    const placeholder = dataDisplay.querySelector('.data-placeholder');
    if (!placeholder) { // Create placeholder if it doesn't exist
        const newPlaceholder = document.createElement('div');
        newPlaceholder.className = 'data-placeholder text-center text-gray-500 dark:text-gray-400 py-4';
        newPlaceholder.setAttribute('data-translate', 'list_empty_option');
        dataDisplay.appendChild(newPlaceholder);
    }

    const actualPlaceholder = dataDisplay.querySelector('.data-placeholder'); // Re-select after potential creation

        if (dataPoints.length === 0) {
        dataDisplay.innerHTML = ''; // Clear potential old items
        actualPlaceholder.textContent = _t('list_empty_option');
        actualPlaceholder.style.display = 'block';
        dataDisplay.appendChild(actualPlaceholder); // Ensure placeholder is there
        } else {
        if (actualPlaceholder) actualPlaceholder.style.display = 'none';
        const fragment = document.createDocumentFragment();
            dataPoints.forEach((p, i) => {
                const item = document.createElement('div');
            item.className = 'py-1 px-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0 flex justify-between items-center text-sm';
            // Use translated format number
            item.innerHTML = `<span class="text-gray-500 dark:text-gray-400 mr-2">${formatNumber(i + 1, 0)}.</span> <span class="font-mono text-gray-800 dark:text-gray-200">${formatNumber(p, 4)}%</span>`;
            fragment.appendChild(item);
        });
        dataDisplay.innerHTML = ''; // Clear previous content
        dataDisplay.appendChild(fragment);
        dataDisplay.scrollTop = 0; // Scroll to top
    }
    updateActionButtonsState();
}

/**
 * Updates the edit dropdown menu options.
 */
function updateEditOptions() {
    if (!editSelect) return;

    const currentSelectedIndexStr = editSelect.value; // Preserve selection if possible
    editSelect.innerHTML = `<option value="" data-translate="select_option">${_t('select_option')}</option>`; // Clear existing options

        if (dataPoints.length === 0) {
        editSelect.options[0].textContent = _t('list_empty_option');
             editSelect.disabled = true;
        } else {
            dataPoints.forEach((p, i) => {
                const option = document.createElement('option');
            option.value = i.toString();
            // Use translated number formatting for display
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

/**
 * Enables/disables edit/delete controls based on data and selection.
 */
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

/**
 * Loads the value of the selected data point into the edit input field.
 */
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

/**
 * Saves the edited value from the input field back to the dataPoints array.
 */
function saveEditedValue() {
    if (selectedEditIndex === -1 || selectedEditIndex >= dataPoints.length) {
        alert(_t('status_select_edit'));
        updateStatus('status_select_edit');
        return;
    }

    const newValStr = editValueEntry.value.trim().replace(/%/g, '');
    if (!newValStr) {
        alert(_t('status_edit_empty'));
        updateStatus('status_edit_empty');
        return;
    }

    // Support comma as decimal separator for editing
    const newVal = parseFloat(newValStr.replace(',', '.'));

    if (isNaN(newVal) || !isFinite(newVal)) {
        alert(_t('status_edit_invalid'));
        updateStatus('status_edit_invalid');
        return;
    }

    try {
        const oldVal = dataPoints[selectedEditIndex];
        dataPoints[selectedEditIndex] = newVal;

        updateDataDisplay();
        updateEditOptions(); // Update dropdown text with new value
        resetResultsDisplay();
        updateActionButtonsState();
        updateStatus('status_data_edited', { index: formatNumber(selectedEditIndex + 1, 0), old_val: formatNumber(oldVal, 2), new_val: formatNumber(newVal, 2) });
        editValueEntry.focus(); // Keep focus

    } catch (e) {
        console.error("Error saving edited value:", e);
        alert(_t('status_edit_index_error'));
        updateStatus('status_edit_index_error');
        selectedEditIndex = -1; // Reset selection on error
        updateEditOptions();
        updateEditControlsState();
    }
}

/**
 * Deletes the selected data point from the dataPoints array.
 */
function deleteSelectedData() {
    if (selectedEditIndex === -1 || selectedEditIndex >= dataPoints.length) {
        alert(_t('status_select_delete'));
        updateStatus('status_select_delete');
        return;
    }

    // Optional: Add confirmation dialog using translated text
    if (!confirm(_t('delete_button') + ` داده ${formatNumber(selectedEditIndex + 1, 0)}؟`)) {
        return;
    }

    try {
        const deletedVal = dataPoints.splice(selectedEditIndex, 1)[0]; // Remove the item
        const deletedIndexHuman = selectedEditIndex + 1; // Store before resetting

        selectedEditIndex = -1; // Reset selection
        editValueEntry.value = ''; // Clear edit input

        updateDataDisplay();
        updateEditOptions();
        resetResultsDisplay();
        updateEditControlsState();
        updateActionButtonsState();
        updateStatus('status_data_deleted', { index: formatNumber(deletedIndexHuman, 0), val: formatNumber(deletedVal, 2) });

    } catch (e) {
        console.error("Error deleting data:", e);
        alert(_t('status_delete_index_error'));
        updateStatus('status_delete_index_error');
        selectedEditIndex = -1;
        updateEditOptions();
        updateEditControlsState();
    }
}

/**
 * Clears all data and resets the UI.
 */
function clearDataList() {
    if (confirm(_t('clear_list_confirm'))) { // Use translated confirmation text
        dataPoints = [];
        calculatedResults = {};
        selectedEditIndex = -1;
        updateDataDisplay();
        updateEditOptions();
        resetResultsDisplay();
        updateEditControlsState();
        updateActionButtonsState();
        updateStatus('status_list_cleared');
        valueEntry.focus();
    }
}

/**
 * Resets the results display area to default values ('-').
 */
function resetResultsDisplay() {
    // Reset all result spans to '-' or N/A
     resultsDisplayDiv.querySelectorAll('span[id^="result-"]').forEach(span => {
        span.textContent = _t('na_value'); // Use N/A as default reset
    });

     // Update labels based on current language
    document.querySelectorAll('#results-display strong[data-translate]').forEach(element => {
         const key = element.getAttribute('data-translate');
        element.textContent = _t(key);
    });

    // Ensure placeholder text for empty list is updated
    const placeholder = dataDisplay.querySelector('.data-placeholder');
    if (placeholder && dataPoints.length === 0) {
        placeholder.textContent = _t('list_empty_option');
    }
}

/**
 * Enables/disables action buttons based on data and calculation state.
 */
function updateActionButtonsState() {
    const hasData = dataPoints.length > 0;
    const hasEnoughDataForCalc = dataPoints.length >= 2;
    // Check if core results exist, not just any key
    const hasResults = calculatedResults && typeof calculatedResults.mean === 'number';

    if (calculateButton) calculateButton.disabled = !hasEnoughDataForCalc;
    if (plotHistButton) plotHistButton.disabled = !hasData; // Allow plotting with 1 point for visual
    if (plotBoxButton) plotBoxButton.disabled = !hasData;
    if (plotEquityButton) plotEquityButton.disabled = !hasData;
    if (plotQqButton) plotQqButton.disabled = !hasEnoughDataForCalc; // QQ needs >= 2 points
    if (exportResultsButton) exportResultsButton.disabled = !hasResults;
    if (exportDataButton) exportDataButton.disabled = !hasData;
    if (clearListButton) clearListButton.disabled = !hasData;
}

/**
 * Performs all statistical calculations and updates the UI.
 */
function calculateMetrics() {
    if (dataPoints.length < 2) {
        alert(_t('status_need_data_calc'));
        updateStatus('status_need_data_calc');
        resetResultsDisplay();
        // Display count even if less than 2
        document.getElementById('result-count').textContent = formatNumber(dataPoints.length, 0);
        return;
    }

    updateStatus('status_calculating');
    calculatedResults = {}; // Reset results

    try {
        // Validate and parse Risk-Free Rate
        const rfStr = rfRateInput.value.trim().replace(/%/g, '');
        const rfRaw = parseFloat(rfStr.replace(',', '.')) || 0.0; // Default to 0 if empty/invalid
        if (isNaN(rfRaw) || !isFinite(rfRaw)) {
            alert(_t('status_rf_error'));
            updateStatus('status_rf_error');
             rfRateInput.focus();
             rfRateInput.select();
             return; // Stop calculation if RF is invalid
        }
        const rf = rfRaw; // Store the valid rate
        calculatedResults['rf'] = rf;

        // Use only finite data points for calculations
        const data = dataPoints.filter(p => isFinite(p));
        const n = data.length;
        calculatedResults['n'] = n;
        calculatedResults['data'] = data; // Store filtered data used for calc

        if (n < 2) { // Double check after filtering
            alert(_t('status_need_data_calc'));
            updateStatus('status_need_data_calc');
            resetResultsDisplay();
            document.getElementById('result-count').textContent = formatNumber(n, 0); // Show filtered count
            return;
        }

        // --- Start Calculations ---
        const mean = calculateMean(data);
        const std = calculateStdDev(data);
        const variance = (std !== null && !isNaN(std)) ? Math.pow(std, 2) : NaN;
        const median = calculatePercentile(data, 50);

        calculatedResults['mean'] = mean;
        calculatedResults['std'] = std;
        calculatedResults['var'] = variance;
        calculatedResults['median'] = median; // Store median for potential use (e.g., plots)

        // Geometric Mean (CAGR)
        const gm = calculateGeometricMean(data);
        calculatedResults['gm'] = gm;

        // Downside Deviation (Target=0)
        const dsd = calculateDownsideDeviation(data, 0);
        calculatedResults['dsd'] = dsd;

        // Coefficient of Variation (CV)
        const cv = (mean !== null && !isNaN(mean) && Math.abs(mean) > 1e-9 && std !== null && !isNaN(std))
                   ? std / mean : NaN;
        calculatedResults['cv'] = cv;

        // Max Drawdown (MDD) and Period
        const mddResult = calculateMaxDrawdown(data);
        calculatedResults['mdd'] = mddResult.maxDrawdown;
        calculatedResults['mdd_period'] = mddResult.duration;

        // Skewness and Kurtosis (using simple-statistics if available)
        let sk = NaN, ku = NaN;
        if (typeof ss !== 'undefined') {
             if (n >= 3 && !isNaN(std) && std > 1e-9) {
                 try { sk = ss.sampleSkewness(data); } catch (e) { console.warn("Skewness calc failed:", e); }
                 try { ku = ss.sampleKurtosis(data); } catch (e) { console.warn("Kurtosis calc failed:", e); }
        } else if (n > 0 && (!isNaN(std) && std <= 1e-9)) {
                 sk = 0.0; // Data has no variation
                 ku = -3.0; // Kurtosis of a single point or constant data
        }
        } else {
             console.warn("simple-statistics library (ss) not loaded. Skewness and Kurtosis cannot be calculated.");
        }
        calculatedResults['skew'] = sk;
        calculatedResults['kurt'] = ku;

        // Historical VaR 5% and Gain 95%
        const var5 = calculatePercentile(data, 5);
        const var95 = calculatePercentile(data, 95);
        calculatedResults['var5'] = var5;
        calculatedResults['var95'] = var95;

        // Max Gain
        const maxGain = (n > 0) ? Math.max(...data) : NaN;
        calculatedResults['max_gain'] = maxGain;

        // Sharpe Ratio
        const sharpe = (std !== null && !isNaN(std) && Math.abs(std) > 1e-9 && mean !== null && !isNaN(mean))
                      ? (mean - rf) / std : NaN;
        calculatedResults['sh'] = sharpe;

        // Sortino Ratio
        let sortino = NaN;
        if (dsd !== null && !isNaN(dsd) && mean !== null && !isNaN(mean)) {
            if (Math.abs(dsd) > 1e-9) {
                sortino = (mean - rf) / dsd;
            } else if (dsd === 0) { // Handle zero downside deviation
                 sortino = (mean - rf > 1e-9) ? Infinity : ((mean - rf < -1e-9) ? -Infinity : 0);
            }
        }
        calculatedResults['so'] = sortino;

        // --- Update UI ---
        updateResultsUI();
        updateActionButtonsState(); // Enable export/plot buttons
        updateStatus('status_calc_done');

    } catch (error) {
        console.error("Error during calculation:", error);
        alert(_t('status_calc_error', { error: error.message }));
        updateStatus('status_calc_error', { error: error.message });
        resetResultsDisplay(); // Clear results on error
        updateActionButtonsState();
    }
}

/**
 * Updates the result display section in the UI based on calculatedResults.
 */
function updateResultsUI() {
    const results = calculatedResults;
    const formatOpt = (digits, percent) => ({ digits: digits, addPercent: percent });

    const updateSpan = (id, value, options) => {
        const span = document.getElementById(id);
        if (span) {
            span.textContent = formatNumber(value, options?.digits, options?.addPercent);
        } else {
            console.warn(`Result span not found: ${id}`);
        }
    };

    updateSpan('result-count', results.n, formatOpt(0, false));
    updateSpan('result-mean', results.mean, formatOpt(2, true));
    updateSpan('result-gm', results.gm, formatOpt(2, true));
    updateSpan('result-std', results.std, formatOpt(2, true));
    updateSpan('result-dsd', results.dsd, formatOpt(2, true));
    updateSpan('result-var', results.var, formatOpt(4, false)); // More precision for variance
    updateSpan('result-cv', results.cv, formatOpt(3, false));
    updateSpan('result-mdd', results.mdd, formatOpt(2, true));
    updateSpan('result-mdd-period', results.mdd_period, formatOpt(0, false));
    updateSpan('result-skew', results.skew, formatOpt(3, false));
    updateSpan('result-kurt', results.kurt, formatOpt(3, false));
    // Normality result span (result-normality) is intentionally left unchanged or shows N/A
     const normSpan = document.getElementById('result-normality');
     if (normSpan) normSpan.textContent = _t('na_value'); // Explicitly set to N/A

    updateSpan('result-var5', results.var5, formatOpt(2, true));
    updateSpan('result-var95', results.var95, formatOpt(2, true));
    updateSpan('result-max-gain', results.max_gain, formatOpt(2, true));
    updateSpan('result-sharpe', results.sh, formatOpt(3, false));
    updateSpan('result-sortino', results.so, formatOpt(3, false));
}

/**
 * Wrapper function to handle plot generation and display in a modal.
 * @param {function} plotFunc - The specific plotting function (e.g., plotHistogramLogic).
 * @param {string} titleKey - The translation key for the plot modal title.
 */
function plotActionWrapper(plotFunc, titleKey) {
    if (dataPoints.length === 0) {
        alert(_t('status_need_data_plot'));
        updateStatus('status_need_data_plot');
        return;
    }

    // Check if calculations are needed or if data changed since last calc
    const currentFiniteData = dataPoints.filter(p => isFinite(p));
    if (Object.keys(calculatedResults).length === 0 || calculatedResults.n !== currentFiniteData.length) {
         // Check if enough data for calc before attempting
         if (currentFiniteData.length < (titleKey === 'plot_qq_title' ? 2 : 1)) { // QQ plot needs 2 points
            alert(_t('status_need_data_calc')); // Or a more specific message
            updateStatus('status_need_data_calc');
            return;
        }
        console.log("Calculating metrics before plotting...");
        calculateMetrics(); // Calculate if results are missing or data length changed
        // Check again if calc failed or resulted in no valid data
        if (!calculatedResults.data || calculatedResults.data.length === 0) {
            console.log("Plot cancelled: metric calculation failed or no valid data after calc.");
            alert(_t('status_plot_error', { error: 'No valid data after calculation.'}));
             return;
         }
    }

    // Use the data stored in results from the last calculation
    const dataToPlot = calculatedResults.data;
    if (!dataToPlot || dataToPlot.length === 0 || (titleKey === 'plot_qq_title' && dataToPlot.length < 2)) {
         alert(_t('status_need_data_plot')); // Or more specific error
         updateStatus('status_need_data_plot');
         return;
     }

    const statusMap = {
        plotHistogramLogic: 'status_plotting_hist',
        plotBoxplotLogic: 'status_plotting_box',
        plotEquityCurveLogic: 'status_plotting_equity',
        plotQqplotLogic: 'status_plotting_qq'
    };
    updateStatus(statusMap[plotFunc.name] || 'status_plotting_hist');

    try {
        const { plotData, layout } = plotFunc(dataToPlot); // Pass the calculated data
        if (!plotData || !layout) throw new Error(_t('plotFailed'));

        layout.autosize = true; // Ensure responsiveness

        plotTitle.textContent = _t(titleKey); // Use correct ID for title

        // Ensure container is clean before plotting
        if (plotContainer) {
             try { Plotly.purge(plotContainer); } catch(e) { console.warn("Minor error purging plot:", e); }
        } else {
             console.error("Plot container not found!");
             throw new Error("Plot container missing.");
        }

        Plotly.newPlot(plotContainer, plotData, layout, {responsive: true});

        // --- Modal Handling ---
        function closeModal() {
            console.log("Closing modal...");
            if (plotModal) {
                plotModal.classList.add('hidden');
                plotModal.classList.remove('flex');
            }
            document.body.style.overflow = 'auto'; // Restore scroll
            // Clean up plot data after modal closes
            if (plotContainer) {
                try { Plotly.purge(plotContainer); } catch(e) { console.error("Error purging plot on close:", e); }
            }
            // Remove listeners specific to this modal instance
             if(plotModalCloseButton) plotModalCloseButton.removeEventListener('click', closeModalHandler);
             if(plotModal) plotModal.removeEventListener('click', backdropClickHandler);
             window.removeEventListener('keydown', escapeKeyHandler); // Remove Escape key listener
        }

        function closeModalHandler() {
            console.log("Close button clicked");
            closeModal();
        }

        function backdropClickHandler(event) {
            if (event.target === plotModal) {
                console.log("Backdrop clicked");
                closeModal();
            }
        }

         function escapeKeyHandler(event) {
             if (event.key === 'Escape') {
                 console.log("Escape key pressed");
                 closeModal();
             }
         }

        // Remove previous listeners before adding new ones
        if(plotModalCloseButton) plotModalCloseButton.removeEventListener('click', closeModalHandler);
        if(plotModal) plotModal.removeEventListener('click', backdropClickHandler);
        window.removeEventListener('keydown', escapeKeyHandler);

        // Add new listeners
        if (plotModalCloseButton) {
            plotModalCloseButton.addEventListener('click', closeModalHandler);
        } else {
            console.error("Plot modal close button not found!");
        }
         if (plotModal) {
             plotModal.addEventListener('click', backdropClickHandler);
             // Add Escape key listener when modal is open
             window.addEventListener('keydown', escapeKeyHandler);
         }

        // Show the modal
        if (plotModal) {
             plotModal.classList.remove('hidden');
             plotModal.classList.add('flex'); // Use flex for centering
             document.body.style.overflow = 'hidden'; // Prevent background scroll
        }
        updateStatus('status_plot_done');

    } catch (error) {
        console.error("Plotting Error:", error);
        alert(_t('status_plot_error', { error: error.message }));
        updateStatus('status_plot_error', { error: error.message });
        // Ensure modal is hidden on error
         if(plotModal) {
             plotModal.classList.add('hidden');
             plotModal.classList.remove('flex');
         }
         document.body.style.overflow = 'auto';
    }
}

// --- Plotting Logic Functions (Modified for Dark Theme Consistency) ---

// Dark Theme Colors (Consistent across plots)
const DARK_BACKGROUND_COLOR = '#111827'; // bg-gray-900
const DARK_CARD_COLOR = '#1f2937';       // bg-gray-800 (Plot Area BG)
const DARK_TEXT_COLOR = '#d1d5db';       // text-gray-300
const DARK_MUTED_COLOR = '#9ca3af';      // text-gray-400 (Gridlines, secondary text)
const DARK_BORDER_COLOR = '#374151';     // border-gray-700
const PRIMARY_COLOR = '#3b82f6';         // Blue-500 (e.g., bars, points)
const ACCENT_COLOR_NEG = '#f87171';      // Red-400 (e.g., VaR line, negative highlight)
const ACCENT_COLOR_POS = '#34d399';      // Emerald-400 (e.g., Gain line, positive highlight)
const ACCENT_COLOR_MEAN = '#fbbf24';     // Amber-400 (Mean line)
const ACCENT_COLOR_MEDIAN = '#60a5fa';   // Blue-400 (Median line)
const ACCENT_COLOR_FIT = '#a78bfa';      // Violet-400 (Fit lines)
const ACCENT_COLOR_EQUITY = '#22c55e';   // Green-500 (Equity curve)


/**
 * Generates Plotly data and layout for the Histogram.
 * @param {number[]} data - Array of finite data points.
 * @returns {object} Object { plotData: array, layout: object }
 */
function plotHistogramLogic(data) {
    const n = data.length;
    const mean = calculatedResults.mean ?? NaN;
    const median = calculatedResults.median ?? NaN;
    const std = calculatedResults.std ?? NaN;
    const var_5 = calculatedResults.var5 ?? NaN;
    const var_95 = calculatedResults.var95 ?? NaN;

    // --- Histogram Trace --- 
    const traceHist = {
        x: data,
        type: 'histogram',
        name: _t('plot_hist_data_label'),
        marker: {
            color: PRIMARY_COLOR,
            line: {
                color: DARK_CARD_COLOR,
                width: 0.5
            }
        },
        histnorm: 'probability density', // Use density for overlay comparison
        hoverinfo: 'x+y' // Show x-range and density
    };

    // --- Normal Distribution Fit Trace ---
    let traceNorm = null;
    if (n > 1 && !isNaN(mean) && !isNaN(std) && std > 1e-9) {
        const xMin = Math.min(...data);
        const xMax = Math.max(...data);
        const range = xMax - xMin;
        const xNorm = [];
        const yNormPDF = [];
        const step = range / 100 || 0.1; // Avoid step=0 if range=0
        const startX = isFinite(xMin) ? xMin - range * 0.1 : mean - 3*std;
        const endX = isFinite(xMax) ? xMax + range * 0.1 : mean + 3*std;

        for (let x = startX; x <= endX; x += step) {
            xNorm.push(x);
            const pdf = (1 / (std * Math.sqrt(2 * Math.PI))) * Math.exp(-Math.pow(x - mean, 2) / (2 * Math.pow(std, 2)));
            yNormPDF.push(pdf);
        }
        traceNorm = {
            x: xNorm,
            y: yNormPDF,
            type: 'scatter',
            mode: 'lines',
            name: _t('plot_norm_label', { mean: formatNumber(mean, 1), std: formatNumber(std, 1) }),
            line: {
                color: ACCENT_COLOR_FIT,
                dash: 'dashdot',
                width: 1.5
            },
            hoverinfo: 'name'
        };
    } else {
        traceHist.histnorm = ''; // Plot frequency if no normal fit possible
    }

    const plotData = [traceHist];
    if (traceNorm) plotData.push(traceNorm);

    // --- Layout --- 
    const layout = {
        title: _t('plot_hist_title'),
        xaxis: {
            title: _t('plot_xlabel'),
            color: DARK_TEXT_COLOR,
            gridcolor: DARK_BORDER_COLOR,
            zerolinecolor: DARK_MUTED_COLOR,
            zeroline: true,
            tickformat: ',.1f' // Format ticks
        },
        yaxis: {
            title: _t(traceHist.histnorm === 'probability density' ? 'plot_ylabel_hist' : 'Frequency'),
            color: DARK_TEXT_COLOR,
            gridcolor: DARK_BORDER_COLOR,
            zerolinecolor: DARK_MUTED_COLOR,
            zeroline: true,
            showgrid: true
        },
        plot_bgcolor: DARK_CARD_COLOR,
        paper_bgcolor: DARK_BACKGROUND_COLOR,
        font: { color: DARK_TEXT_COLOR, family: 'Vazirmatn, sans-serif' },
        legend: {
            bgcolor: 'rgba(31, 41, 55, 0.8)', // Slightly transparent dark-card
            bordercolor: DARK_BORDER_COLOR,
            borderwidth: 1,
            x: 0.02, y: 0.98, // Top-left
            font: { color: DARK_TEXT_COLOR }
        },
        bargap: 0.05,
        shapes: [], // Add lines below
        margin: { l: 60, r: 30, t: 50, b: 50 } // Standard margins
    };

    // Add vertical lines using shapes and dummy traces for legend
    const addLine = (xVal, color, nameKey, args = {}, dash = 'dash') => {
        if (!isNaN(xVal)) {
            const lineName = _t(nameKey, args);
            layout.shapes.push({
                type: 'line', x0: xVal, y0: 0, x1: xVal, y1: 1, yref: 'paper',
                line: { color: color, width: 2, dash: dash },
                name: lineName // Add name to shape for potential hover
            });
            // Dummy trace for legend entry
             plotData.push({
                x: [null], y: [null], mode: 'lines',
                line: { color: color, width: 2, dash: dash }, name: lineName,
                hoverinfo: 'name'
             });
        }
    };

    addLine(mean, ACCENT_COLOR_MEAN, 'plot_mean_label', { val: formatNumber(mean, 2) }, 'solid');
    addLine(median, ACCENT_COLOR_MEDIAN, 'plot_median_label', { val: formatNumber(median, 2) }, 'dashdot');
    addLine(var_5, ACCENT_COLOR_NEG, 'plot_var_label', { val: formatNumber(var_5, 2) }, 'dot');
    addLine(var_95, ACCENT_COLOR_POS, 'plot_gain_label', { val: formatNumber(var_95, 2) }, 'dot');

    return { plotData, layout };
}


/**
 * Generates Plotly data and layout for the Box Plot.
 * @param {number[]} data - Array of finite data points.
 * @returns {object} Object { plotData: array, layout: object }
 */
function plotBoxplotLogic(data) {
    // --- Box Plot Trace --- 
    const traceBox = {
        y: data,
        type: 'box',
        name: ' ', // No name needed for single box
        boxpoints: 'all', // Show individual points
        jitter: 0.4,      // Spread points slightly
        pointpos: 0,      // Center points
        marker: {         // Style for individual points
            color: PRIMARY_COLOR,
            size: 4,
            opacity: 0.7,
            line: { color: DARK_BORDER_COLOR, width: 0.5 } // Point border
        },
        line: {           // Style for box lines (median, whiskers)
            color: DARK_TEXT_COLOR
        },
        fillcolor: 'rgba(59, 130, 246, 0.3)', // Semi-transparent primary color fill
        hoverinfo: 'y',   // Show y-value on hover
        boxmean: 'sd'     // Show mean and standard deviation diamond
    };

    const plotData = [traceBox];

    // --- Layout --- 
    const layout = {
        title: _t('plot_box_title'),
        yaxis: {
            title: _t('plot_ylabel_box'),
            color: DARK_TEXT_COLOR,
            gridcolor: DARK_BORDER_COLOR,
            zerolinecolor: DARK_MUTED_COLOR,
            zeroline: true,
            showgrid: true,
            tickformat: ',.1f' // Format ticks
        },
        xaxis: {
            showticklabels: false, // Hide x-axis labels
            zeroline: false,
            showgrid: false
        },
        plot_bgcolor: DARK_CARD_COLOR,
        paper_bgcolor: DARK_BACKGROUND_COLOR,
        font: {
            color: DARK_TEXT_COLOR,
            family: 'Vazirmatn, sans-serif'
        },
        showlegend: false, // No legend needed
        margin: { l: 60, r: 30, t: 50, b: 30 } // Adjust margins
    };

    return { plotData, layout };
}


/**
 * Generates Plotly data and layout for the Equity Curve.
 * @param {number[]} data - Array of finite data points (returns in percentage).
 * @returns {object} Object { plotData: array, layout: object }
 */
function plotEquityCurveLogic(data) {
    const initialValue = 1000;
    const equityCurve = [initialValue];
    let currentValue = initialValue;

    for (const returnPerc of data) {
        // Handle potential non-finite returns robustly
        currentValue *= (1 + (isFinite(returnPerc) ? returnPerc : 0) / 100.0);
        equityCurve.push(currentValue);
    }

    const indices = Array.from({ length: equityCurve.length }, (_, i) => i);

    // --- Equity Curve Trace --- 
    const traceEquity = {
        x: indices,
        y: equityCurve,
        type: 'scatter',
        mode: 'lines', // Use lines only for cleaner look
        name: _t('plot_equity_title'), // Use title as name
        line: {
            color: ACCENT_COLOR_EQUITY, // Consistent green
            width: 1.8
        },
        hoverinfo: 'x+y' // Show period and value
    };

    const plotData = [traceEquity];

    // --- Layout --- 
    const layout = {
        title: _t('plot_equity_title'),
        xaxis: {
            title: _t('plot_equity_xlabel'),
            color: DARK_TEXT_COLOR,
            gridcolor: DARK_BORDER_COLOR,
            zerolinecolor: DARK_MUTED_COLOR,
            showgrid: true,
            zeroline: false // X-axis zeroline usually not needed
        },
        yaxis: {
            title: _t('plot_equity_ylabel'),
            color: DARK_TEXT_COLOR,
            gridcolor: DARK_BORDER_COLOR,
            zerolinecolor: DARK_MUTED_COLOR,
            zeroline: false, // Y-axis zeroline often distracting
            showgrid: true,
            tickformat: ',.0f' // Format as integer with commas
        },
        plot_bgcolor: DARK_CARD_COLOR,
        paper_bgcolor: DARK_BACKGROUND_COLOR,
        font: {
            color: DARK_TEXT_COLOR,
            family: 'Vazirmatn, sans-serif'
        },
        showlegend: false,
        shapes: [ // Optional: Add horizontal line at initial value
            {
                type: 'line', x0: 0, y0: initialValue, x1: indices.length - 1, y1: initialValue,
                xref: 'x', yref: 'y',
                line: { color: DARK_MUTED_COLOR, width: 1, dash: 'dot' }
            }
        ],
        margin: { l: 70, r: 30, t: 50, b: 50 } // Adjust margins
    };

    return { plotData, layout };
}

/**
 * Generates Plotly data and layout for the QQ Plot.
 * Uses ss.probit for theoretical quantiles.
 * @param {number[]} data - Array of finite data points.
 * @returns {object} Object { plotData: array, layout: object } or throws error
 */
function plotQqplotLogic(data) {
    if (data.length < 2) throw new Error("QQ Plot requires at least 2 data points.");

    if (typeof ss === 'undefined' || typeof ss.probit !== 'function') {
        console.error("simple-statistics (ss) library or ss.probit function not available.");
        throw new Error("Required statistics library function (ss.probit) is missing.");
    }

    const sortedData = [...data].sort((a, b) => a - b);
    const n = sortedData.length;

    // --- Calculate Theoretical Quantiles using ss.probit ---
    const theoreticalQuantiles = [];
         for (let i = 0; i < n; i++) {
        // Using Blom's plotting position P = (i + 1 - a) / (n + 1 - 2a) with a=3/8
             const rank = (i + 1 - 3/8) / (n + 1/4);
        // Clamp rank to avoid Infinity from probit at exact 0 or 1
             const safeRank = Math.max(1e-9, Math.min(1 - 1e-9, rank));
             try {
                 const z = ss.probit(safeRank);
                 theoreticalQuantiles.push(z);
        } catch (probitError) {
            console.warn(`ss.probit calculation failed for rank ${safeRank}`, probitError);
                 theoreticalQuantiles.push(NaN); // Push NaN on error
             }
         }

    // Filter out any pairs where theoretical quantile calculation failed
    const validPairs = theoreticalQuantiles
        .map((q, i) => ({ theo: q, sample: sortedData[i] }))
        .filter(pair => isFinite(pair.theo) && isFinite(pair.sample));

    if (validPairs.length < 2) {
        console.warn("Not enough valid quantile pairs calculated to plot QQ.");
        throw new Error("Could not calculate sufficient valid quantiles for QQ plot.");
    }

    const validTheoreticalQuantiles = validPairs.map(p => p.theo);
    const validSortedData = validPairs.map(p => p.sample);

    // --- Plotly Traces ---
    const traceScatter = {
        x: validTheoreticalQuantiles,
        y: validSortedData,
        mode: 'markers',
        type: 'scatter',
        name: 'Data Quantiles',
        marker: {
            color: PRIMARY_COLOR,
            size: 5,
            opacity: 0.8,
            line: { color: DARK_BORDER_COLOR, width: 0.5 }
        },
        hoverinfo: 'x+y'
    };

    // Fit line based on sample mean and std dev (robustly handle calculation)
    const sampleMean = calculatedResults.mean ?? calculateMean(validSortedData);
    const sampleStd = calculatedResults.std ?? calculateStdDev(validSortedData);
    const lineX = [];
    const lineY = [];

    if (!isNaN(sampleMean) && !isNaN(sampleStd) && sampleStd > 1e-9) {
         const minTheoQuantile = Math.min(...validTheoreticalQuantiles);
         const maxTheoQuantile = Math.max(...validTheoreticalQuantiles);
         lineX.push(minTheoQuantile, maxTheoQuantile);
         lineY.push(sampleMean + minTheoQuantile * sampleStd, sampleMean + maxTheoQuantile * sampleStd);
    } else {
         console.warn("Cannot draw reference line due to invalid mean/std.");
         // Optionally draw y=x if std is zero? Or just omit the line.
    }


    const traceLine = {
        x: lineX,
        y: lineY,
        mode: 'lines',
        type: 'scatter',
        name: 'Normal Reference Line',
        line: {
            color: ACCENT_COLOR_NEG, // Use red for contrast
            width: 1.5,
            dash: 'dash'
        },
        hoverinfo: 'name'
    };

    const plotData = [traceScatter];
    if (lineX.length > 0) plotData.push(traceLine); // Only add line if calculable

    // --- Layout --- 
    const layout = {
        title: _t('plot_qq_title'),
        xaxis: {
            title: _t('plot_qq_xlabel'),
            color: DARK_TEXT_COLOR,
            gridcolor: DARK_BORDER_COLOR,
            zerolinecolor: DARK_MUTED_COLOR,
            zeroline: true,
            showgrid: true,
             tickformat: '.2f' // Format quantiles
        },
        yaxis: {
            title: _t('plot_qq_ylabel'),
            color: DARK_TEXT_COLOR,
            gridcolor: DARK_BORDER_COLOR,
            zerolinecolor: DARK_MUTED_COLOR,
            zeroline: true,
            showgrid: true,
             tickformat: ',.1f' // Format sample data ticks
        },
        plot_bgcolor: DARK_CARD_COLOR,
        paper_bgcolor: DARK_BACKGROUND_COLOR,
        font: {
            color: DARK_TEXT_COLOR,
            family: 'Vazirmatn, sans-serif'
        },
        showlegend: false, // Legend not very useful here
        hovermode: 'closest',
        margin: { l: 60, r: 30, t: 50, b: 50 }
    };

    return { plotData, layout };
}


// --- File Import/Export ---

/**
 * Handles file input change to import data from CSV or Excel.
 * Uses SheetJS (xlsx) library. Robustly finds the first numeric column.
 * @param {Event} event - The file input change event.
 */
function importDataFromFile(event) {
    const file = event.target.files[0];
    if (!file) {
        updateStatus('status_import_cancel');
        return;
    }
    // Check file type basic validation
    const allowedExtensions = /(\.csv|\.xlsx|\.xls)$/i;
    if (!allowedExtensions.exec(file.name)) {
        alert(_t('invalid_format_msg'));
        updateStatus('status_import_format_error');
        event.target.value = null; // Reset file input
        return;
    }

    updateStatus('status_importing', { filename: file.name });

    const reader = new FileReader();
    reader.onload = function(e) {
        const fileData = e.target.result;
        let workbook;
        let sheetData = [];

        try {
            // Use SheetJS to read the file data (handles CSV, XLS, XLSX)
            workbook = XLSX.read(fileData, { type: 'binary', cellDates: false }); // Read as binary, don't parse dates
                      const firstSheetName = workbook.SheetNames[0];
            if (!firstSheetName) throw new Error("No sheets found in the workbook.");
                      const worksheet = workbook.Sheets[firstSheetName];
            // Convert sheet to array of arrays (robust against empty cells)
            sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: null });

            if (!sheetData || sheetData.length === 0) {
                throw new Error("Sheet is empty or could not be read.");
            }

            // Find the first column with predominantly numeric data
            let numericData = [];
            const numCols = sheetData[0]?.length || 0;
            let bestColIndex = -1;
            let maxNumericCount = -1;

            for (let j = 0; j < numCols; j++) {
                 let currentColData = [];
                 let numericCount = 0;
                 let nonNumericCount = 0; // Track non-numeric entries

                for (let i = 0; i < sheetData.length; i++) {
                    // Skip rows without data in this column
                    if (!sheetData[i] || sheetData[i][j] === null || sheetData[i][j] === undefined) {
                        continue; 
                    }
                    const rawValue = String(sheetData[i][j]).replace(/%/g, '').trim();
                    if (rawValue === '') continue;

                    const value = parseFloat(rawValue.replace(',', '.')); // Handle comma decimal

                    if (!isNaN(value) && isFinite(value)) {
                        currentColData.push(value);
                        numericCount++;
                    } else {
                         nonNumericCount++;
                         // Optionally store NaN or skip? Storing helps align indices if needed later
                         // currentColData.push(NaN);
                         // Stop considering this column if it seems non-numeric early on?
                         // Heuristic: If more than 5 non-numeric found, maybe skip?
                         // if (nonNumericCount > 5) break;
                    }
                }

                 // Choose the column with the most numeric entries found so far
                 // Add a condition to prefer columns with fewer non-numeric entries as tie-breaker
                 if (numericCount > 0 && numericCount > maxNumericCount) {
                     maxNumericCount = numericCount;
                     bestColIndex = j;
                     numericData = currentColData; // Store the numeric data from this best column
                 }
            }


            if (bestColIndex === -1 || numericData.length === 0) {
                throw new Error(_t('status_import_no_numeric'));
            }

            console.log(`Imported ${numericData.length} values from column ${bestColIndex + 1}.`);

            // --- Update Application State ---
            dataPoints = numericData;
            calculatedResults = {}; // Clear old results
            selectedEditIndex = -1; // Reset edit selection

            // --- Update UI ---
            updateDataDisplay();
            updateEditOptions();
            resetResultsDisplay();
            updateEditControlsState();
            updateActionButtonsState();
            updateStatus('status_import_success', { count: dataPoints.length });
            alert(_t('status_import_success', { count: dataPoints.length })); // Notify user

        } catch (error) {
            console.error("File Read/Parse Error:", error);
            alert(`${_t('error_title')}: ${_t('file_read_error_msg', { error: error.message || 'Unknown error' })}`);
            updateStatus('status_import_error');
        } finally {
            // Reset file input regardless of success/failure to allow re-importing
            event.target.value = null;
        }
    };

    reader.onerror = function(error) {
        console.error("FileReader Error:", error);
        alert(`${_t('error_title')}: ${_t('file_read_error_msg', { error: 'FileReader failed' })}`);
        updateStatus('status_import_error');
        event.target.value = null; // Reset file input
    };

    reader.readAsBinaryString(file); // Read as binary string for SheetJS
}


/**
 * Exports the calculated results and input data to a text file.
 */
function exportResultsToTxt() {
    if (!calculatedResults || !calculatedResults.data) { // Check for data existence in results
        alert(_t('status_no_results'));
        updateStatus('status_no_results');
        return;
    }
    updateStatus('status_saving_results');

    const lines = [];
    const results = calculatedResults;
    const inputData = dataPoints; // Use the original dataPoints for export
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

        // Helper to get label and value text robustly
        const getResultLine = (labelKey, resultKey, options) => {
            const label = _t(labelKey);
            const value = formatNumber(results[resultKey], options?.digits, options?.addPercent);
            return `${label}: ${value}`;
        };

        lines.push(getResultLine('mean_label', 'mean', formatOpt(2, true)));
        lines.push(getResultLine('geo_mean_label', 'gm', formatOpt(2, true)));
        lines.push(getResultLine('std_dev_label', 'std', formatOpt(2, true)));
        lines.push(getResultLine('downside_dev_label', 'dsd', formatOpt(2, true)));
        lines.push(getResultLine('variance_label', 'var', formatOpt(4, false)));
        lines.push(getResultLine('cv_label', 'cv', formatOpt(3, false)));
        lines.push(getResultLine('mdd_label', 'mdd', formatOpt(2, true)));
        lines.push(getResultLine('mdd_period_label', 'mdd_period', formatOpt(0, false)));
        lines.push(getResultLine('skewness_label', 'skew', formatOpt(3, false)));
        lines.push(getResultLine('kurtosis_label', 'kurt', formatOpt(3, false)));
        // Normality line - indicate removed
        lines.push(`${_t('normality_label')}: ${_t('na_value')} (Calculation Removed)`);
        lines.push(getResultLine('var_label', 'var5', formatOpt(2, true)));
        lines.push(getResultLine('var_95_label', 'var95', formatOpt(2, true)));
        lines.push(getResultLine('max_gain_label', 'max_gain', formatOpt(2, true)));
        lines.push(getResultLine('sharpe_label', 'sh', formatOpt(3, false)));
        lines.push(getResultLine('sortino_label', 'so', formatOpt(3, false)));

        lines.push("\n" + "=".repeat(50));
        lines.push(`Input Data (${inputData.length} points):`); // Use length of original dataPoints
        lines.push("-".repeat(50));
        lines.push(...inputData.map((p, i) => `${formatNumber(i + 1, 0)}. ${formatNumber(p, 4)}%`)); // Use original data
        lines.push("=".repeat(50));

        const outputText = lines.join('\n');
        const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
        // Generate filename with date
        const dateStr = now.toISOString().slice(0, 10); // YYYY-MM-DD
        const filename = `RiskAnalysisResults_${dateStr}.txt`;

        downloadBlob(blob, filename);
        updateStatus('status_save_success', { filename: filename });

    } catch (error) {
        console.error("Error exporting results:", error);
        alert(_t('file_save_error_msg', { error: error.message }));
        updateStatus('status_save_error');
    }
}

/**
 * Exports the current dataPoints array to an Excel (.xlsx) file.
 */
function exportDataToExcel() {
    if (dataPoints.length === 0) {
        alert(_t('status_no_data_save'));
        updateStatus('status_no_data_save');
        return;
    }
    updateStatus('status_saving_data');

    try {
        // Prepare data in Array-of-Arrays format for SheetJS
        const dataToExport = [
            [_t('col_index'), _t('col_return')] // Translated headers
        ];
        dataPoints.forEach((point, index) => {
            // Export raw numeric value
            dataToExport.push([index + 1, point]);
        });

        // Create worksheet and workbook
        const ws = XLSX.utils.aoa_to_sheet(dataToExport);
        // Set column widths (optional)
        ws['!cols'] = [{ wch: 10 }, { wch: 18 }]; // Adjust widths as needed
        // Apply number format to the return column (optional)
        // Example: format as percentage with 4 decimal places
        const range = XLSX.utils.decode_range(ws['!ref']);
        for (let R = range.s.r + 1; R <= range.e.r; ++R) { // Start from row 1 (skip header)
             const cell_address = { c: 1, r: R }; // Column 1 (Return %)
             const cell_ref = XLSX.utils.encode_cell(cell_address);
             if (ws[cell_ref]) {
                 ws[cell_ref].t = 'n'; // Ensure type is number
                 ws[cell_ref].z = '0.0000%'; // Excel percentage format string
             }
        }


        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "ReturnsData"); // Sheet name

        // Generate filename with date
        const now = new Date();
        const dateStr = now.toISOString().slice(0, 10); // YYYY-MM-DD
        const filename = `ReturnData_${dateStr}.xlsx`;

        // Trigger download using SheetJS's writeFile
        XLSX.writeFile(wb, filename);

        updateStatus('status_data_save_success', { filename: filename });

    } catch (error) {
        console.error("Error exporting data to Excel:", error);
        alert(_t('file_save_error_msg', { error: error.message }));
        updateStatus('status_save_error');
    }
}

/**
 * Utility function to trigger browser download for a Blob.
 * @param {Blob} blob - The data Blob to download.
 * @param {string} filename - The desired filename.
 */
function downloadBlob(blob, filename) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    // Clean up
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

// --- Tooltip Handling (Event Delegation) ---

/**
 * Initializes tooltip functionality by attaching listeners to the body.
 */
function initializeTooltips() {
    // Remove potentially existing listeners to prevent duplicates
    document.body.removeEventListener('mouseover', handleTooltipMouseover);
    document.body.removeEventListener('mouseout', handleTooltipMouseout);
    document.body.removeEventListener('focusin', handleTooltipMouseover); // Add focus for keyboard nav
    document.body.removeEventListener('focusout', handleTooltipMouseout); // Add focusout

    // Add delegated event listeners to the body
    document.body.addEventListener('mouseover', handleTooltipMouseover);
    document.body.addEventListener('mouseout', handleTooltipMouseout);
    document.body.addEventListener('focusin', handleTooltipMouseover);
    document.body.addEventListener('focusout', handleTooltipMouseout);
    console.log("Tooltip event listeners attached to body.");
}

/**
 * Handles mouseover/focusin events on potential tooltip triggers.
 * @param {Event} event - The mouseover or focusin event.
 */
function handleTooltipMouseover(event) {
    // Find the closest ancestor or self that is a tooltip icon
    const icon = event.target.closest('.tooltip-icon');
    if (!icon) return; // Exit if the event wasn't on or inside an icon

    const tooltipKey = icon.getAttribute('data-tooltip');
    if (!tooltipKey) return; // Exit if no tooltip key found

    const tooltipText = _t(tooltipKey); // Get translated text
    if (!tooltipText) return; // Exit if translation missing

    // --- Create or Get Tooltip Element ---
    let tooltipElement = document.getElementById('dynamic-tooltip');
    if (!tooltipElement) {
        tooltipElement = document.createElement('div');
        tooltipElement.id = 'dynamic-tooltip';
        tooltipElement.className = 'tooltip-popup absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm dark:bg-gray-700 whitespace-nowrap pointer-events-none'; // Basic styling + prevent interaction
        tooltipElement.setAttribute('role', 'tooltip');
        document.body.appendChild(tooltipElement);
        console.log("Tooltip element created.");
    }

    // --- Update and Position Tooltip ---
    tooltipElement.innerHTML = tooltipText.replace(/\n/g, '<br>'); // Set text, handle newlines
    tooltipElement.style.display = 'block'; // Make it visible *before* positioning

    const rect = icon.getBoundingClientRect();
    const tooltipRect = tooltipElement.getBoundingClientRect(); // Get size after setting text

    // Position above the icon, centered horizontally
    let top = rect.top + window.scrollY - tooltipRect.height - 8; // Position above, 8px gap
    let left = rect.left + window.scrollX + (rect.width / 2) - (tooltipRect.offsetWidth / 2);

    // Adjust position if off-screen
    if (top < window.scrollY + 5) { // Too close to top
        top = rect.bottom + window.scrollY + 8; // Position below instead
    }
    if (left < window.scrollX + 5) { // Too far left
        left = window.scrollX + 5;
    }
    if (left + tooltipRect.width > document.documentElement.clientWidth + window.scrollX - 5) { // Too far right
        left = document.documentElement.clientWidth + window.scrollX - tooltipRect.width - 5;
    }

    tooltipElement.style.top = `${Math.max(0, top)}px`; // Ensure not negative
    tooltipElement.style.left = `${Math.max(0, left)}px`; // Ensure not negative

    console.log(`Tooltip shown for key: ${tooltipKey}`);
}

/**
 * Handles mouseout/focusout events to hide the tooltip.
 * @param {Event} event - The mouseout or focusout event.
 */
function handleTooltipMouseout(event) {
    const icon = event.target.closest('.tooltip-icon');
    // Check if the event target OR the related target (where mouse moved to) is the icon
    // This prevents hiding if mouse moves briefly off then back on
     if (icon || (event.relatedTarget && event.relatedTarget.closest && event.relatedTarget.closest('.tooltip-icon'))) {
        // Don't hide immediately if moving between icon elements or focusing out to re-focus
        return;
     }


    const tooltipElement = document.getElementById('dynamic-tooltip');
    if (tooltipElement) {
        tooltipElement.style.display = 'none'; // Hide the tooltip
        console.log("Tooltip hidden.");
    }
}


// --- Calculation Helpers --- (Copied from previous version, assumed correct)

/** Calculates the arithmetic mean. */
function calculateMean(data) {
    if (!data || data.length === 0) return NaN;
    const sum = data.reduce((acc, val) => acc + val, 0);
    return sum / data.length;
}

/** Calculates the standard deviation (sample). */
function calculateStdDev(data) {
    if (!data || data.length < 2) return NaN;
    const mean = calculateMean(data);
    if (isNaN(mean)) return NaN;
    const variance = data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (data.length - 1);
    return Math.sqrt(variance);
}

/** Calculates the percentile of a dataset (linear interpolation). */
function calculatePercentile(data, percentile) {
    if (!data || data.length === 0 || percentile < 0 || percentile > 100) return NaN;
     // Create a sorted copy to avoid modifying the original array
    const sortedData = [...data].sort((a, b) => a - b);
    const n = sortedData.length;
    if (percentile === 0) return sortedData[0];
    if (percentile === 100) return sortedData[n - 1];

     // Calculate the index using linear interpolation formula (p/100 * (n-1))
    const index = (percentile / 100) * (n - 1);
    const lowerIndex = Math.floor(index);
    const upperIndex = Math.ceil(index);
     const weight = index - lowerIndex; // Fractional part

     if (lowerIndex === upperIndex) { // Index is an integer
        return sortedData[lowerIndex];
     } else { // Interpolate between the two surrounding values
          // Ensure indices are within bounds (should be by logic, but safe check)
         const lowerValue = sortedData[lowerIndex] ?? sortedData[0];
         const upperValue = sortedData[upperIndex] ?? sortedData[n-1];
         return lowerValue * (1 - weight) + upperValue * weight;
     }
}


/** Calculates the Geometric Mean (CAGR) in percentage. */
function calculateGeometricMean(data) {
    if (!data || data.length === 0) return NaN;
    let product = 1.0;
    for (const p of data) {
        const growthFactor = 1 + p / 100.0;
        // Handle returns of -100% or less, which lead to zero or negative growth factors
        if (growthFactor <= 1e-9) {
            return NaN; // Cannot calculate GM if any factor is zero or negative
        }
        product *= growthFactor;
    }
    // Check for potential floating point issues resulting in slightly negative product
    if (product < 0) return NaN;
    // Calculate the nth root and convert back to percentage return
    return (Math.pow(product, 1.0 / data.length) - 1.0) * 100.0;
}

/** Calculates the Downside Deviation (Sample - using n-1 denominator). */
function calculateDownsideDeviation(data, target = 0) {
    if (!data || data.length < 2) return NaN; // Need at least 2 points for sample calc
    const n = data.length;
    // Filter returns *strictly below* the target
    const downsideReturns = data.filter(r => r < target);

    if (downsideReturns.length === 0) return 0.0; // No returns below target

    // Sum of squared deviations FROM THE TARGET for points below target
    const sumSqDev = downsideReturns.reduce((acc, r) => acc + Math.pow(r - target, 2), 0);

    // Divide by total number of samples minus 1 (n-1) for sample standard deviation logic
    return Math.sqrt(sumSqDev / (n - 1));
}

/** Calculates the Maximum Drawdown and its duration. */
function calculateMaxDrawdown(returnsPerc) {
    if (!returnsPerc || returnsPerc.length === 0) {
        return { maxDrawdown: 0.0, duration: 0, peakIndex: 0, troughIndex: 0 };
    }
    // Ensure only finite numbers are used
    const dataArr = returnsPerc.filter(p => isFinite(p));
    if (dataArr.length === 0) {
        return { maxDrawdown: 0.0, duration: 0, peakIndex: 0, troughIndex: 0 };
    }

    // Calculate cumulative wealth index (starts at 1)
    let cumulative = [1.0];
    dataArr.forEach(r => {
        cumulative.push(cumulative[cumulative.length - 1] * (1 + r / 100.0));
    });

    let maxDd = 0.0; // Max drawdown is negative, so initialize to 0
    let peakIndex = 0;
    let troughIndex = 0;
    let currentPeakValue = cumulative[0];
    let currentPeakIndex = 0;

    for (let i = 1; i < cumulative.length; i++) {
        // Update peak if a higher value is found
        if (cumulative[i] > currentPeakValue) {
            currentPeakValue = cumulative[i];
            currentPeakIndex = i;
        } else {
            // Calculate drawdown from the current peak
            // Avoid division by zero if peak is zero or negative (unlikely with starting value 1)
            const currentDrawdown = (currentPeakValue <= 1e-9) ? 0 : (cumulative[i] / currentPeakValue - 1.0) * 100.0;

            // Check if this is the worst drawdown found so far
            if (currentDrawdown < maxDd) {
                maxDd = currentDrawdown;
                peakIndex = currentPeakIndex; // Record index of the peak *before* this max drawdown
                troughIndex = i; // Record index of the trough (current position)
            }
        }
    }

    const duration = troughIndex - peakIndex;

    return {
        maxDrawdown: isFinite(maxDd) ? maxDd : 0.0,
        duration: isFinite(duration) ? duration : 0,
        peakIndex: peakIndex, // Index in cumulative array (0 to n)
        troughIndex: troughIndex // Index in cumulative array (0 to n)
    };
}


console.log("script.js loaded and initialized.");