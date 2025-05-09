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
    'status_save_success': {'en': "Results saved to '{filename}'."}, // Generic, might be overridden
    'status_save_cancel': {'en': "Save operation cancelled.", 'fa': "عملیات ذخیره‌سازی لغو شد."},
    'status_save_error': {'en': "Error saving file.", 'fa': "خطا در ذخیره‌سازی فایل."},
    'status_import_cancel': {'en': "Import operation cancelled or no file dropped.", 'fa': "عملیات ورود داده لغو شد یا فایلی انتخاب نشد."},
    'status_importing': {'en': "Reading file '{filename}'...", 'fa': "درحال خواندن فایل '{filename}'..."},
    'status_import_success': {'en': "{count} data points imported successfully.", 'fa': "{count} داده با موفقیت وارد شد."},
    'status_import_error': {'en': "Error reading file.", 'fa': "خطا در خواندن فایل."},
    'status_import_format_error': {'en': "Error: Invalid file format. Please drop a CSV, Excel, or TXT file.", 'fa': "خطا: فرمت فایل نامعتبر است. لطفاً یک فایل CSV، Excel یا TXT انتخاب کنید."},
    'status_import_no_numeric': {'en': "Error: No numeric column found in the file.", 'fa': "خطا: هیچ ستون عددی در فایل پیدا نشد."},
    'status_import_no_valid': {'en': "Error: No valid numeric data found in the file/column.", 'fa': "خطا: هیچ داده عددی معتبری در فایل/ستون پیدا نشد."},
    'status_rf_error': {'en': "Error: Invalid Risk-Free Rate.", 'fa': "خطا: نرخ بدون ریسک نامعتبر است."},
    'status_need_data_calc': {'en': "Insufficient data for calculation (min 2 points).", 'fa': "داده کافی برای محاسبات وجود ندارد (حداقل ۲ نقطه)."},
    'status_need_data_plot': {'en': "No data to plot.", 'fa': "داده‌ای برای رسم نمودار وجود ندارد."},
    'status_no_results': {'en': "No results to save.", 'fa': "نتیجه‌ای برای ذخیره وجود ندارد."},
    'status_no_data_save': {'en': "No data to save.", 'fa': "داده‌ای برای ذخیره وجود ندارد."},
    'status_select_edit': {'en': "Select an item to edit first.", 'fa': "ابتدا یک مورد را برای ویرایش انتخاب کنید."},
    'status_select_delete': {'en': "Select an item to delete first.", 'fa': "ابتدا یک مورد را برای حذف انتخاب کنید."},
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
    'normality_label': {'en': "Normality (Shapiro-Wilk)", 'fa': "نرمال بودن (شاپیرو-ویلک)"},
    'var_label': {'en': "Historical VaR 5%", 'fa': "VaR تاریخی ۵٪"},
    'var_95_label': {'en': "Historical Gain 95%", 'fa': "سود تاریخی ۹۵٪"},
    'max_gain_label': {'en': "Max Gain", 'fa': "حداکثر سود"},
    'sharpe_label': {'en': "Sharpe Ratio", 'fa': "نسبت شارپ"},
    'sortino_label': {'en': "Sortino Ratio", 'fa': "نسبت سورتینو"},
    // 'save_results_button': {'en': "Save Results to Text File", 'fa': "ذخیره نتایج در فایل متنی"}, // Replaced
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
        'en': `**Arithmetic Mean Return:**
This is the simple average of observed returns over a period. While easy to calculate, it should be interpreted cautiously.

**Use & Considerations for CFA:**
*   **Starting Point:** Initial estimate of central tendency.
*   **Outlier Sensitivity:** Extreme values can heavily skew the mean.
*   **No Compounding Effect:** Doesn\'t reflect reinvestment of returns. Geometric mean (CAGR) is better for long-term performance.
*   **Comparison with Median:** Significant difference can indicate skewness.
*   **Best Use:** Estimating expected return for a single future period, assuming market conditions don\'t change.`,
        'fa': `**میانگین حسابی بازده (Arithmetic Mean Return):**
این شاخص، میانگین ساده بازده‌های مشاهده شده در یک دوره زمانی معین است (مجموع بازده‌ها تقسیم بر تعداد دوره‌ها). اگرچه محاسبه آن آسان است و نقطه شروعی برای تحلیل بازده فراهم می‌کند، اما باید با احتیاط تفسیر شود.

**کاربرد و ملاحظات برای تحلیلگر مالی (CFA):**
*   **نقطه شروع تحلیل:** اولین برآورد از بازده مرکزی یک دارایی یا سبد در یک دوره مشخص.
*   **حساسیت به داده‌های پرت (Outliers):** بازده‌های بسیار بزرگ یا بسیار کوچک (چه مثبت و چه منفی) می‌توانند میانگین حسابی را به شدت تحت تأثیر قرار داده و تصویر نادرستی از بازده "معمول" ارائه دهند.
*   **عدم نمایش اثر مرکب شدن:** میانگین حسابی، اثر مرکب شدن بازده‌ها در طول زمان (reinvestment of returns) را در نظر نمی‌گیرد. برای ارزیابی عملکرد بلندمدت سرمایه‌گذاری، میانگین هندسی (CAGR) شاخص مناسب‌تری است.
*   **مقایسه با میانه (Median):** تفاوت قابل توجه بین میانگین حسابی و میانه می‌تواند نشانه‌ای از چولگی (skewness) در توزیع بازده‌ها باشد.
*   **بهترین کاربرد:** برای تخمین بازده مورد انتظار یک دارایی در یک دوره واحد در آینده (با فرض عدم تغییر شرایط بازار).`
    },
    'geo_mean_tooltip': {
        'en': `**Geometric Mean (CAGR):** The average rate of return over multiple periods, assuming profits are reinvested. More accurate for time-series data like investment returns.\n\n*Usefulness:* Reflects the compound growth rate of an investment. Crucial for understanding long-term performance.`,
        'fa': "**میانگین هندسی (CAGR):** میانگین نرخ بازده در چندین دوره، با فرض سرمایه‌گذاری مجدد سودها. برای داده‌های سری زمانی مانند بازده سرمایه‌گذاری دقیق‌تر است.\n\n*کاربرد:* نرخ رشد مرکب یک سرمایه‌گذاری را منعکس می‌کند. برای درک عملکرد بلندمدت حیاتی است."
    },
    'std_dev_tooltip': {
        'en': `**Standard Deviation of Returns:**
A key statistical measure of the total volatility or dispersion of returns around their arithmetic mean. Represents the Total Risk of an investment.

**Use & Considerations for CFA:**
*   **Primary Risk Metric:** Higher standard deviation implies greater volatility, thus higher uncertainty and risk.
*   **Risk Comparison:** Used to compare the risk of different investments (assuming normal or near-normal return distributions).
*   **Input for Financial Models:** Essential input for CAPM, portfolio optimization models (e.g., Markowitz), and Sharpe Ratio calculations.
*   **Interpret with Mean:** Should always be considered alongside the mean return. Coefficient of Variation (CV) combines these.
*   **Normality Assumption Limitation:** Most effective when return distributions are approximately normal. For significant skewness or kurtosis, other risk measures (downside deviation, VaR, ES) might be more appropriate.
*   **Calculation:** Square root of variance.`,
        'fa': `**انحراف معیار بازده (Standard Deviation of Returns):**
یک شاخص آماری کلیدی برای اندازه‌گیری میزان پراکندگی یا نوسان کل بازده‌های یک دارایی یا سبد حول میانگین حسابی آن در یک دوره معین. این شاخص، ریسک کل (Total Risk) سرمایه‌گذاری را نمایندگی می‌کند.

**کاربرد و ملاحظات برای تحلیلگر مالی (CFA):**
*   **معیار اصلی ریسک:** انحراف معیار بالاتر به معنای نوسانات بیشتر و در نتیجه، عدم قطعیت بالاتر در مورد بازده‌های آتی و ریسک بیشتر است.
*   **مقایسه ریسک دارایی‌ها:** برای مقایسه ریسک سرمایه‌گذاری‌های مختلف (با فرض توزیع نرمال یا نزدیک به نرمال بازده‌ها).
*   **ورودی مدل‌های مالی:** در بسیاری از مدل‌های مالی مانند مدل قیمت‌گذاری دارایی‌های سرمایه‌ای (CAPM)، مدل‌های بهینه‌سازی پورتفولیو (مانند مارکویتز) و محاسبات نسبت شارپ، انحراف معیار یک ورودی اساسی است.
*   **تفسیر در کنار میانگین:** انحراف معیار باید همیشه در کنار میانگین بازده تفسیر شود. ضریب تغییرات (CV) این دو را با هم ترکیب می‌کند.
*   **محدودیت فرض توزیع نرمال:** انحراف معیار به عنوان معیار ریسک، زمانی بهترین کارایی را دارد که توزیع بازده‌ها تقریباً نرمال (متقارن و زنگوله‌ای شکل) باشد. در صورت وجود چولگی یا کشیدگی قابل توجه، معیارهای ریسک دیگری مانند انحراف معیار نزولی، VaR یا ES ممکن است مناسب‌تر باشند.
*   **محاسبه:** جذر واریانس.`
    },
    'downside_dev_tooltip': {'en': `**Downside Deviation (Target=0):** Measures volatility of returns below a target return (here, 0%). Focuses only on negative volatility or \'bad\' risk.\n\n*Usefulness:* Helps differentiate between 'good' volatility (upside) and 'bad' volatility (downside). Used in Sortino Ratio.`, 'fa': `**انحراف معیار نزولی (هدف=۰):** نوسان بازده‌های کمتر از یک بازده هدف (در اینجا ۰٪) را اندازه‌گیری می‌کند. فقط بر نوسانات منفی یا ریسک 'بد' تمرکز دارد.\n\n*کاربرد:* به تمایز بین نوسان 'خوب' (روند صعودی) و نوسان 'بد' (روند نزولی) کمک می‌کند. در نسبت سورتینو استفاده می‌شود.`},
    'variance_tooltip': {
        'en': `**Variance of Returns:**
The average of the squared deviations of returns from their arithmetic mean. Like standard deviation, it measures return dispersion.

**Use & Considerations for CFA:**
*   **Basis for Standard Deviation:** Standard deviation is the square root of variance. Variance itself is less directly interpreted due to its squared unit.
*   **Mathematical Properties:** Variance has useful mathematical properties for statistical and financial models (e.g., calculating portfolio variance).
*   **Less Intuitive:** Being in squared units, its direct interpretation for risk is harder than standard deviation.
*   **Outlier Sensitivity:** Highly affected by outliers, similar to arithmetic mean and standard deviation.`,
        'fa': `**واریانس بازده (Variance of Returns):**
واریانس، میانگین مجذور انحرافات بازده‌ها از میانگین حسابی‌شان است. این شاخص، مانند انحراف معیار، میزان پراکندگی یا نوسان بازده‌ها را اندازه‌گیری می‌کند.

**کاربرد و ملاحظات برای تحلیلگر مالی (CFA):**
*   **پایه محاسبه انحراف معیار:** انحراف معیار، جذر واریانس است. واریانس به خودی خود به دلیل واحد مربع آن (مثلاً درصد مربع) کمتر به طور مستقیم تفسیر می‌شود.
*   **خواص ریاضی:** واریانس دارای خواص ریاضی مفیدی است که استفاده از آن را در مدل‌های آماری و مالی (مانند محاسبه واریانس پورتفولیو) تسهیل می‌کند. برای مثال، واریانس مجموع متغیرهای تصادفی مستقل، برابر با مجموع واریانس‌های آنهاست (برخلاف انحراف معیار).
*   **عدم شهود مستقیم:** از آنجا که واحد آن مجذور واحد بازده است، تفسیر مستقیم و شهودی آن برای ریسک، دشوارتر از انحراف معیار است.
*   **حساسیت به داده‌های پرت:** همانند میانگین حسابی و انحراف معیار، واریانس نیز به شدت تحت تأثیر داده‌های پرت قرار می‌گیرد.`
    },
    'cv_tooltip': {'en': "**Coefficient of Variation (CV):** Standard deviation divided by the absolute mean return. Measures risk per unit of return. Useful for comparing investments with different return levels.\n\n*Usefulness:* Provides a standardized measure of risk relative to return. Higher CV means more risk for each unit of expected return.", 'fa': "**ضریب تغییرات (CV):** انحراف معیار تقسیم بر قدر مطلق میانگین بازده. ریسک به ازای هر واحد بازده را اندازه‌گیری می‌کند. برای مقایسه سرمایه‌گذاری‌ها با سطوح بازده مختلف مفید است.\n\n*کاربرد:* یک معیار استاندارد شده از ریسک نسبت به بازده ارائه می‌دهد. CV بالاتر به معنای ریسک بیشتر برای هر واحد بازده مورد انتظار است."},
    'mdd_tooltip': {'en': "**Maximum Drawdown (MDD):** The largest peak-to-trough decline during a specific period. Represents the worst possible loss from a previous high.\n\n*Usefulness:* Indicates the maximum potential loss an investor might have experienced. A key measure of downside risk and resilience.", 'fa': "**حداکثر افت سرمایه (MDD):** بزرگترین کاهش از اوج تا حضیض در یک دوره خاص. نشان‌دهنده بدترین زیان ممکن از یک سقف قبلی است.\n\n*کاربرد:* حداکثر زیان بالقوه‌ای که یک سرمایه‌گذار ممکن است تجربه کرده باشد را نشان می‌دهد. یک معیار کلیدی برای ریسک نزولی و انعطاف‌پذیری است."},
    'mdd_period_tooltip': {'en': "**MDD Period (steps):** The number of periods (data points) over which the maximum drawdown occurred, from peak to trough.\n\n*Usefulness:* Shows how long the worst losing streak lasted. Provides context to the MDD magnitude.", 'fa': "**دوره MDD (تعداد دوره):** تعداد دوره‌ها (نقاط داده) که حداکثر افت سرمایه در طول آن رخ داده است، از اوج تا حضیض.\n\n*کاربرد:* نشان می‌دهد که بدترین دوره زیان‌ده چه مدت طول کشیده است. به بزرگی MDD زمینه می‌بخشد."},
    'skewness_tooltip': {'en': "**Skewness:** Measures the asymmetry of the return distribution. \nPositive: Tail on the right (more large gains). \nNegative: Tail on the left (more large losses).\nZero: Symmetrical.\n\n*Usefulness:* Indicates the likelihood of extreme positive or negative returns. Investors often prefer positive skewness.", 'fa': "**چولگی:** عدم تقارن توزیع بازده را اندازه‌گیری می‌کند. \nمثبت: دنباله در سمت راست (سودهای بزرگ بیشتر). \nمنفی: دنباله در سمت چپ (زیان‌های بزرگ بیشتر).\nصفر: متقارن.\n\n*کاربرد:* احتمال بازده‌های شدید مثبت یا منفی را نشان می‌دهد. سرمایه‌گذاران اغلب چولگی مثبت را ترجیح می‌دهند."},
    'kurtosis_tooltip': {'en': "**Excess Kurtosis:** Measures the 'tailedness' of the distribution. \nPositive (Leptokurtic): Fatter tails, more outliers (extreme events are more likely than normal distribution). \nNegative (Platykurtic): Thinner tails, fewer outliers. \nZero for normal distribution.\n\n*Usefulness:* Indicates the risk of extreme outcomes (fat tails). High kurtosis suggests higher probability of large shocks.", 'fa': "**کشیدگی اضافی:** 'دنباله‌دار بودن' توزیع را اندازه‌گیری می‌کند. \nمثبت (لپتوکورتیک): دنباله‌های چاق‌تر، مقادیر پرت بیشتر (وقایع شدید محتمل‌تر از توزیع نرمال هستند). \nمنفی (پلاتیکورتیک): دنباله‌های لاغرتر، مقادیر پرت کمتر. \nبرای توزیع نرمال صفر است.\n\n*کاربرد:* ریسک نتایج شدید (دنباله‌های چاق) را نشان می‌دهد. کشیدگی بالا نشان‌دهنده احتمال بیشتر شوک‌های بزرگ است."},
    'normality_tooltip': {'en': "**Normality (Shapiro-Wilk Test):** This statistical test assesses if the data likely comes from a normally distributed population. (Note: Actual test is not performed in this version; placeholder.)\n\n*Usefulness:* Many financial models assume normality. If data is not normal, model assumptions might be violated.", 'fa': "**نرمال بودن (آزمون شاپیرو-ویلک):** این آزمون آماری بررسی می‌کند که آیا داده‌ها احتمالاً از یک جامعه با توزیع نرمال آمده‌اند یا خیر. (توجه: آزمون واقعی در این نسخه انجام نمی‌شود؛ صرفاً یک جایگزین است.)\n\n*کاربرد:* بسیاری از مدل‌های مالی نرمال بودن را فرض می‌کنند. اگر داده‌ها نرمال نباشند، ممکن است مفروضات مدل نقض شوند."},
    'var_tooltip': {'en': "**Historical VaR 5% (Value at Risk):** The maximum loss expected (with 95% confidence) over a single period, based on historical data. E.g., a VaR 5% of -2% means there is a 5% chance of losing 2% or more.\n\n*Usefulness:* Provides an estimate of downside risk in a single number. Widely used in risk management.", 'fa': "**ارزش در معرض خطر (VaR) ۵٪ تاریخی:** حداکثر زیان مورد انتظار (با اطمینان ۹۵٪) در یک دوره واحد، بر اساس داده‌های تاریخی. به عنوان مثال، VaR ۵٪ برابر با ۲-% به این معنی است که ۵٪ احتمال دارد ۲٪ یا بیشتر زیان کنید.\n\n*کاربرد:* تخمینی از ریسک نزولی را در یک عدد واحد ارائه می‌دهد. به طور گسترده در مدیریت ریسک استفاده می‌شود."},
    'var_95_tooltip': {'en': "**Historical Gain 95%:** The return that was exceeded 95% of the time historically. Represents a high-probability positive outcome.\n\n*Usefulness:* Shows the level of gain achieved in the vast majority of historical periods. Complements VaR by looking at the positive side.", 'fa': "**سود تاریخی ۹۵٪:** بازدهی که در ۹۵٪ مواقع تاریخی از آن فراتر رفته است. نشان‌دهنده یک نتیجه مثبت با احتمال بالا است.\n\n*کاربرد:* سطح سودی که در اکثریت قریب به اتفاق دوره‌های تاریخی به دست آمده است را نشان می‌دهد. با نگاه کردن به جنبه مثبت، VaR را تکمیل می‌کند."},
    'max_gain_tooltip': {'en': "**Maximum Gain:** The single best return observed in the data series.\n\n*Usefulness:* Highlights the highest upside potential experienced historically. Can be an indicator of explosive growth potential, but also of high volatility if combined with large losses.", 'fa': "**حداکثر سود:** بهترین بازده مشاهده شده در سری داده‌ها.\n\n*کاربرد:* بالاترین پتانسیل رشد تجربه شده در تاریخ را برجسته می‌کند. می‌تواند نشانه‌ای از پتانسیل رشد انفجاری باشد، اما در صورت ترکیب با زیان‌های بزرگ، نشانه‌ای از نوسانات بالا نیز هست."},
    'sharpe_tooltip': {'en': "**Sharpe Ratio:** (Mean Return - Risk-Free Rate) / Standard Deviation. Measures risk-adjusted return. Higher is better.\n\n*Usefulness:* Indicates how much excess return (above risk-free rate) is generated per unit of total risk (standard deviation). Allows comparison of different investments on a risk-adjusted basis.", 'fa': "**نسبت شارپ:** (میانگین بازده - نرخ بازده بدون ریسک) / انحراف معیار. بازده تعدیل‌شده بر اساس ریسک را اندازه‌گیری می‌کند. مقدار بالاتر بهتر است.\n\n*کاربرد:* نشان می‌دهد به ازای هر واحد ریسک کل (انحراف معیار) چه مقدار بازده مازاد (بالاتر از نرخ بدون ریسک) تولید می‌شود. امکان مقایسه سرمایه‌گذاری‌های مختلف را بر اساس تعدیل ریسک فراهم می‌کند."},
    'sortino_tooltip': {'en': "**Sortino Ratio:** (Mean Return - Risk-Free Rate) / Downside Deviation. Similar to Sharpe, but only penalizes for downside volatility. Higher is better.\n\n*Usefulness:* Preferred by some over Sharpe as it doesn't penalize for 'good' (upside) volatility. Focuses on return relative to 'bad' risk.", 'fa': "**نسبت سورتینو:** (میانگین بازده - نرخ بازده بدون ریسک) / انحراف معیار نزولی. مشابه نسبت شارپ است، اما فقط برای نوسانات نزولی جریمه در نظر می‌گیرد. مقدار بالاتر بهتر است.\n\n*کاربرد:* توسط برخی به نسبت شارپ ترجیح داده می‌شود زیرا برای نوسانات 'خوب' (روند صعودی) جریمه در نظر نمی‌گیرد. بر بازده نسبت به ریسک 'بد' تمرکز دارد."},
    'rf_tooltip': {'en': "**Risk-Free Rate (% Annually):** The theoretical rate of return of an investment with zero risk (e.g., government bonds). Used as a benchmark for other investments.\n\n*Usefulness:* Essential for calculating risk-adjusted return metrics like Sharpe and Sortino ratios. Represents the opportunity cost of taking on risk.", 'fa': "**نرخ بازده بدون ریسک (% سالانه):** نرخ بازده نظری یک سرمایه‌گذاری با ریسک صفر (مثلاً اوراق قرضه دولتی). به عنوان معیاری برای سایر سرمایه‌گذاری‌ها استفاده می‌شود.\n\n*کاربرد:* برای محاسبه معیارهای بازده تعدیل‌شده بر اساس ریسک مانند نسبت‌های شارپ و سورتینو ضروری است. هزینه فرصت پذیرش ریسک را نشان می‌دهد."},
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
    'save_results_txt_button': {'en': "Save Results to TXT", 'fa': "ذخیره نتایج به TXT"}, // Kept for reference, but button is unified
    'save_results_excel_button': {'en': "Save Results to Excel", 'fa': "ذخیره نتایج به Excel"}, // Kept for reference
    'excel_sheet_results_title': {'en': "Analysis Results", 'fa': "نتایج تحلیل"},
    'excel_sheet_raw_data_title': {'en': "Raw Data", 'fa': "داده‌های خام"},
    'status_saving_txt_success': {'en': "Results saved to TXT file '{filename}'.", 'fa': "نتایج با موفقیت در فایل متنی '{filename}' ذخیره شد."},
    'status_saving_excel_success': {'en': "Results saved to Excel file '{filename}'.", 'fa': "نتایج با موفقیت در فایل اکسل '{filename}' ذخیره شد."},
    'save_results_button_unified': {'en': "Save Results", 'fa': "ذخیره نتایج"},
    'export_format_title': {'en': "Select Export Format", 'fa': "انتخاب فرمت خروجی"},
    'export_txt': {'en': "Text File (.txt)", 'fa': "فایل متنی (.txt)"},
    'export_excel': {'en': "Excel File (.xlsx)", 'fa': "فایل اکسل (.xlsx)"},
    // 'export_pdf': {'en': "PDF File (.pdf)", 'fa': "فایل PDF (.pdf)"}, // Removed PDF
    'status_saving_pdf_success': {'en': "Results saved to PDF file '{filename}'.", 'fa': "نتایج با موفقیت در فایل PDF '{filename}' ذخیره شد."},
    // 'include_charts_q': {'en': "Include charts in PDF?", 'fa': "آیا نمودارها در PDF ذخیره شوند؟"}, // Removed PDF
    // 'metric_header_pdf': {'en': "Metric", 'fa': "شاخص"}, // Removed PDF
    // 'value_header_pdf': {'en': "Value", 'fa': "مقدار"}  // Removed PDF
    'boxplot_hover_stats': {'fa': 'آمار جعبه', 'en': 'Box Statistics'},
    'boxplot_hover_max': {'fa': 'بیشینه (حصار بالا)', 'en': 'Max (Upper Fence)'},
    'boxplot_hover_q3': {'fa': 'چارک سوم (Q3)', 'en': 'Q3'},
    'boxplot_hover_median': {'fa': 'میانه', 'en': 'Median'},
    'boxplot_hover_q1': {'fa': 'چارک اول (Q1)', 'en': 'Q1'},
    'boxplot_hover_min': {'fa': 'کمینه (حصار پایین)', 'en': 'Min (Lower Fence)'},
    'boxplot_hover_mean': {'fa': 'میانگین', 'en': 'Mean'},
    'boxplot_hover_std': {'fa': 'انحراف معیار', 'en': 'Std. Dev.'},
    'plot_ylabel_box': {'fa': 'درصد بازده (%)', 'en': 'Return (%)'}, 
    'plot_box_title': {'fa': 'نمودار جعبه‌ای بازده‌ها', 'en': 'Box Plot of Returns'},
    'equity_curve_label': {'fa': 'منحنی ارزش تجمعی', 'en': 'Equity Curve'},
    'hwm_trace_label': {'fa': 'بیشترین ارزش (HWM)', 'en': 'High Watermark (HWM)'},
    'period_label': {'fa': 'دوره', 'en': 'Period'},
    'equity_value_label': {'fa': 'ارزش پرتفوی', 'en': 'Portfolio Value'},
    'hwm_label': {'fa': 'بیشترین ارزش تا کنون', 'en': 'High Watermark'},
    'drawdown_from_hwm_label': {'fa': 'افت از بیشترین ارزش', 'en': 'Drawdown from HWM'},
    'plot_xlabel_equity': {'fa': 'تعداد دوره سپری شده', 'en': 'Number of Periods'},
    'plot_ylabel_equity_value': {'fa': 'ارزش (مبنای ۱۰۰)', 'en': 'Value (Base 100)'},
    'mdd_period_label': {'fa': 'دوره حداکثر افت سرمایه', 'en': 'Max Drawdown Period'}, // Already exists but ensure used if needed
    'qq_data_quantiles_label': {'fa': 'چارک‌های داده', 'en': 'Data Quantiles'},
    'qq_norm_ref_line_label': {'fa': 'خط مرجع نرمال', 'en': 'Normal Reference Line'},
    'qq_hover_point': {'fa': 'نقطه چارک', 'en': 'Quantile Point'},
    'qq_hover_theoretical': {'fa': 'چارک نظری', 'en': 'Theoretical Quantile'},
    'qq_hover_sample': {'fa': 'چارک نمونه', 'en': 'Sample Quantile'},
    'status_qq_insufficient_points': {'fa': 'نقاط معتبر کافی برای رسم نمودار QQ وجود ندارد.', 'en': 'Not enough valid data points to plot QQ chart.'},
    'error_lib_missing': {'fa': 'کتابخانه مورد نیاز ({lib}) یافت نشد.', 'en': 'Required library ({lib}) not found.'},
    'cvar_label': {
        'fa': "CVaR ۵٪ (کسری مورد انتظار)",
        'en': "CVaR 5% (Expected Shortfall)"
    },
    'cvar_tooltip': {
        'fa': `**ارزش در معرض خطر شرطی (CVaR) / کسری مورد انتظار (ES) ۵٪:**
این معیار میانگین زیان‌هایی است که در ۵٪ بدترین سناریوها (یعنی زمانی که زیان از VaR ۵٪ بیشتر می‌شود) رخ می‌دهد.
برخلاف VaR که فقط نقطه برش زیان را نشان می‌دهد، CVaR شدت زیان‌های فراتر از VaR را اندازه‌گیری می‌کند.

**اهمیت برای تحلیلگر مالی (CFA):**
*   **درک بهتر ریسک دنباله (Tail Risk):** CVaR دید عمیق‌تری نسبت به زیان‌های شدید و نادر ارائه می‌دهد.
*   **مکمل VaR:** اطلاعات کامل‌تری نسبت به VaR در مورد توزیع زیان‌ها در ناحیه دنباله فراهم می‌کند.
*   **مورد ترجیح در مدیریت ریسک پیشرفته:** بسیاری از نهادهای نظارتی و فعالان حرفه‌ای بازار، CVaR را به دلیل تصویر واقعی‌تر از ریسک‌های شدید، بر VaR ترجیح می‌دهند.`,
        'en': `**Conditional Value at Risk (CVaR) / Expected Shortfall (ES) 5%:**
This metric represents the average loss in the worst 5% of scenarios (i.e., when losses exceed the VaR 5% threshold).
Unlike VaR, which only indicates the cutoff point for losses, CVaR measures the severity of losses beyond the VaR.

**Significance for CFA Charterholders:**
*   **Better Understanding of Tail Risk:** CVaR provides deeper insight into extreme and infrequent losses.
*   **Complements VaR:** Offers more complete information about the distribution of losses in the tail region compared to VaR.
*   **Preferred in Advanced Risk Management:** Many regulatory bodies and market professionals prefer CVaR over VaR for its more realistic portrayal of extreme risks.`
    },
    'omega_label': {
        'fa': "نسبت اُمگا (آستانه: RF)",
        'en': "Omega Ratio (Threshold: RF)"
    },
    'omega_tooltip': {
        'fa': `**نسبت اُمگا (Omega Ratio):**
یک معیار عملکرد تعدیل شده بر اساس ریسک است که کل توزیع بازده را در نظر می‌گیرد، نه فقط میانگین و واریانس (مانند نسبت شارپ).
این نسبت، مجموع بازده‌های مطلوب (بالاتر از یک آستانه، معمولاً نرخ بدون ریسک) را به مجموع بازده‌های نامطلوب (پایین‌تر از همان آستانه) مقایسه می‌کند.

**اهمیت برای تحلیلگر مالی (CFA):**
*   **تحلیل جامع‌تر ریسک و بازده:** به خصوص برای توزیع‌های بازده غیرنرمال (چوله یا با کشیدگی زیاد) مفید است، جایی که معیارهای سنتی ممکن است تصویر کاملی ارائه ندهند.
*   **عدم وابستگی به مفروضات خاص توزیع:** برخلاف نسبت شارپ، به طور ضمنی نرمال بودن توزیع بازده را فرض نمی‌گیرد.
*   **در نظر گرفتن تمام گشتاورها:** به طور غیرمستقیم تمام گشتاورهای توزیع بازده را در محاسبات خود لحاظ می‌کند.
*   مقدار بالاتر نشان‌دهنده عملکرد بهتر است.`,
        'en': `**Omega Ratio:**
A risk-adjusted performance measure that considers the entire distribution of returns, not just mean and variance (like the Sharpe Ratio).
It compares the sum of desirable returns (above a threshold, typically the risk-free rate) to the sum of undesirable returns (below the same threshold).

**Significance for CFA Charterholders:**
*   **More Comprehensive Risk-Return Analysis:** Particularly useful for non-normal return distributions (skewed or with high kurtosis) where traditional metrics might not provide a complete picture.
*   **No Dependence on Specific Distributional Assumptions:** Unlike the Sharpe Ratio, it doesn't implicitly assume normality of returns.
*   **Considers All Moments:** Indirectly incorporates all moments of the return distribution in its calculation.
*   A higher value indicates better performance.`
    }
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
const exportResultsButton = document.getElementById('export-results-button'); // Unified export button
const dedicatedFileDropArea = document.getElementById('dedicated-file-drop-area');
const statusBar = document.getElementById('status-bar');
const resultsDisplayDiv = document.getElementById('results-display');
const plotModal = document.getElementById('plotModal');
const plotModalLabel = document.getElementById('plotModalLabel');
const plotContainer = document.getElementById('plot-container');
const plotModalCloseButton = document.getElementById('plotModalCloseButton');
const fileImporterInput = document.getElementById('file-importer-input');

// --- Utility Functions ---
function _t(key, args = {}) {
    const langTexts = texts[key];
    let text = key;
    if (langTexts) {
        text = langTexts[currentLang] || langTexts['en'] || key;
    }
    if (args && typeof args === 'object') {
        for (const argKey in args) {
            const regex = new RegExp(`\\{(?:${argKey})\\}`, 'g');
            text = text.replace(regex, args[argKey]);
        }
    }
    return text;
}

function updateStatus(key, args = {}, type = 'info') {
    const message = _t(key, args);
    statusBar.textContent = message;
    statusBar.className = 'status-bar p-2 rounded text-sm text-center'; 
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
    document.title = _t('app_title');

    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        if (texts[key] && texts[key][currentLang]) {
            el.textContent = _t(key);
        } else if (texts[key] && texts[key]['en']) {
             el.textContent = _t(key); 
        }
    });

    document.querySelectorAll('[data-translate-placeholder]').forEach(el => {
         const key = el.getAttribute('data-translate-placeholder');
         if(key) el.placeholder = _t(key);
    });

    updateEditOptions(); 
    // initializeTooltips(); // REMOVED - This was causing the error

    if (Object.keys(calculatedResults).length > 0) {
        updateResultsUI(); 
    }
    console.log(`Language changed to: ${currentLang}`);
}


async function processImportedFile(file) {
    if (!file) {
        updateStatus('status_import_cancel', {}, 'warning');
        return;
    }
    updateStatus('status_importing', { filename: file.name }, 'info');

    const allowedTypes = [
        'text/csv',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
        'application/vnd.ms-excel', 
        'text/plain' 
    ];
    const allowedExtensions = /(\.csv|\.xlsx|\.xls|\.txt)$/i;
    const fileNameLower = file.name.toLowerCase();
    const fileType = file.type;
    const isAllowed = allowedTypes.includes(fileType) || allowedExtensions.test(fileNameLower);

    if (!isAllowed) {
        const errorMsg = _t('invalid_format_msg');
        Swal.fire({ title: _t('error_title'), html: errorMsg, icon: 'error', confirmButtonText: _t('ok_button') });
        updateStatus('status_import_format_error', {}, 'error'); 
        return;
    }

    const reader = new FileReader();

    reader.onload = async function(e) {
        try {
            const fileData = e.target.result;
            let importedData = [];

            if (fileNameLower.endsWith('.txt') || fileType === 'text/plain') {
                console.log("Parsing TXT file...");
                const textContent = new TextDecoder().decode(new Uint8Array(fileData));
                const lines = textContent.split(/\r?\n/);
                lines.forEach((line, index) => {
                    const cleanedLine = line.replace(/%/g, '').trim();
                    if (cleanedLine !== '') { 
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
            else {
                console.log("Parsing CSV/Excel file...");
                let workbook;
                 if (fileNameLower.endsWith('.csv')) {
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
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: null });

                if (jsonData.length === 0) {
                     throw new Error("Sheet appears to be empty.");
                }

                let numericColumnFound = false;
                let targetColumnIndex = -1;
                const numCols = jsonData[0]?.length || 0;
                console.log(`Sheet dimensions: ${jsonData.length} rows, ${numCols} columns`);

                if (numCols > 0) {
                    for (let j = 0; j < numCols; j++) {
                        let numericCount = 0;
                        // let potentialData = []; // Not strictly needed if just counting
                        for (let i = 0; i < jsonData.length; i++) {
                             if (jsonData[i] && typeof jsonData[i][j] === 'number' && isFinite(jsonData[i][j])) {
                                 numericCount++;
                                 // potentialData.push(jsonData[i][j]);
                             }
                             else if (jsonData[i] && typeof jsonData[i][j] === 'string') {
                                 const cleanedValue = jsonData[i][j].replace(/%/g, '').trim();
                                 if (cleanedValue !== '') {
                                     const value = parseFloat(cleanedValue.replace(',', '.'));
                                     if (!isNaN(value) && isFinite(value)) {
                                         numericCount++;
                                         // potentialData.push(value); 
                                     }
                                 }
                             }
                        }
                        console.log(`Column ${j+1} numeric count: ${numericCount}`);
                        if (numericCount > jsonData.length / 2) {
                            targetColumnIndex = j;
                            numericColumnFound = true;
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
                            break; 
                        }
                    }
                }
                if (!numericColumnFound) {
                    throw new Error(_t('status_import_no_numeric'));
                }
            } 

            if (importedData.length > 0) {
                dataPoints.push(...importedData);
                updateDataDisplay();
                updateEditOptions();
                updateActionButtonsState();
                resetResultsDisplay(); 
                updateStatus('status_import_success', { count: importedData.length }, 'success');
            } else {
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
    reader.readAsArrayBuffer(file);
}

function setupDragAndDrop() {
    if (!dedicatedFileDropArea) {
        console.warn("Dedicated file drop area not found. Drag and drop will not be initialized.");
        return;
    }
    console.log("Setting up drag and drop for:", dedicatedFileDropArea);

    dedicatedFileDropArea.addEventListener('click', () => {
        if (fileImporterInput) {
            fileImporterInput.click();
        }
    });

    if (fileImporterInput) {
        fileImporterInput.addEventListener('change', async (event) => {
            const files = event.target.files;
            if (files.length > 0) {
                console.log(`File selected via input: ${files[0].name}`);
                await processImportedFile(files[0]);
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
        event.preventDefault(); 
        dedicatedFileDropArea.classList.add('drag-over-active');
        event.dataTransfer.dropEffect = 'copy'; 
    });

    dedicatedFileDropArea.addEventListener('dragleave', (event) => {
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
            await processImportedFile(files[0]); 
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
        return _t('na_value'); 
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

function addDataPoint() {
    const rawInput = valueEntry.value.trim();
    if (!rawInput) {
        updateStatus('status_empty_input', {}, 'info'); 
        valueEntry.focus();
        return;
    }
    const potentialValues = rawInput.split(/[\s,;\\n\t]+/).filter(val => val); 
    let addedCount = 0;
    const invalidEntries = [];
    const newlyAddedData = [];

    potentialValues.forEach(rawVal => {
        const cleanedValue = rawVal.replace(/%/g, '').trim();
        if (!cleanedValue) return;
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
        dataPoints.push(...newlyAddedData);
        updateDataDisplay();
        updateEditOptions();
        resetResultsDisplay(); 
        updateActionButtonsState();

        let statusKey = 'status_data_added';
        let statusArgs = { count: addedCount };
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
        Swal.fire(_t('error_title'), _t('status_no_valid_data'), 'error');
        updateStatus('status_no_valid_data', {}, 'error');
    }

    valueEntry.value = ''; 
    valueEntry.focus();
    updateEditControlsState(); 
}


function updateDataDisplay() {
    const placeholder = dataDisplay.querySelector('.data-placeholder');
    if (!placeholder) { 
        const newPlaceholder = document.createElement('p'); 
        newPlaceholder.className = 'data-placeholder text-center text-dark-text-muted p-4';
        newPlaceholder.setAttribute('data-translate', 'list_empty_option');
        dataDisplay.appendChild(newPlaceholder);
    }
    const actualPlaceholder = dataDisplay.querySelector('.data-placeholder'); 

    if (dataPoints.length === 0) {
        dataDisplay.innerHTML = ''; 
        actualPlaceholder.textContent = _t('list_empty_option');
        actualPlaceholder.style.display = 'block';
        dataDisplay.appendChild(actualPlaceholder); 
    } else {
        if (actualPlaceholder) actualPlaceholder.style.display = 'none'; 
        const fragment = document.createDocumentFragment();
        dataPoints.forEach((p, i) => {
            const item = document.createElement('div');
            item.className = 'py-1 px-2 border-b border-dark-border last:border-b-0 flex justify-between items-center text-sm';
            item.innerHTML = `<span class="text-dark-text-muted mr-2">${formatNumber(i + 1, 0)}.</span> <span class="font-mono text-dark-text">${formatNumber(p, 4)}%</span>`;
            fragment.appendChild(item);
        });
        dataDisplay.innerHTML = ''; 
        dataDisplay.appendChild(fragment);
    }
    updateActionButtonsState(); 
}

function updateEditOptions() {
    if (!editSelect) return;
    const currentSelectedIndexStr = editSelect.value; 
    editSelect.innerHTML = `<option value="" data-translate="select_option">${_t('select_option')}</option>`;

    if (dataPoints.length === 0) {
        editSelect.options[0].textContent = _t('list_empty_option');
        editSelect.options[0].setAttribute('data-translate', 'list_empty_option'); 
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
        editValueEntry.value = dataPoints[selectedEditIndex].toString();
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
        customClass: { 
             popup: 'swal2-popup', title: 'swal2-title', htmlContainer: 'swal2-html-container', confirmButton: 'swal2-confirm', cancelButton: 'swal2-cancel', closeButton: 'swal2-close'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            try {
                const deletedVal = dataPoints.splice(selectedEditIndex, 1)[0];
                const deletedIndexHuman = selectedEditIndex + 1; 
                selectedEditIndex = -1; editValueEntry.value = ''; 
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

function clearDataList() {
    if (dataPoints.length === 0) return; 
    Swal.fire({
        title: _t('clear_list_confirm'),
        text: _t('confirm_clear_text'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: _t('clear_list_button'), 
        cancelButtonText: _t('cancel_button'),
         customClass: { 
             popup: 'swal2-popup', title: 'swal2-title', htmlContainer: 'swal2-html-container', confirmButton: 'swal2-confirm', cancelButton: 'swal2-cancel', closeButton: 'swal2-close'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            dataPoints = []; calculatedResults = {}; selectedEditIndex = -1;
            updateDataDisplay(); updateEditOptions(); resetResultsDisplay(); updateEditControlsState(); updateActionButtonsState();
            updateStatus('status_list_cleared', {}, 'success');
            valueEntry.focus();
             Swal.fire(_t('cleared_title'), _t('status_list_cleared'), 'success'); 
        }
    });
}

function resetResultsDisplay() {
    console.log("Resetting results display to N/A."); 
    resultsDisplayDiv.querySelectorAll('span[id^="result-"]').forEach(span => {
        span.textContent = _t('na_value'); 
        span.classList.remove('text-highlight-pos', 'text-highlight-neg', 'text-highlight-neutral', 'text-dark-text');
        span.classList.add('text-dark-text-muted'); 
    });
    document.querySelectorAll('#results-display strong[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        element.textContent = _t(key);
    });
    const placeholder = dataDisplay.querySelector('.data-placeholder');
    if (placeholder && dataPoints.length === 0) {
        placeholder.textContent = _t('list_empty_option');
    }
}

function updateActionButtonsState() {
    const hasData = dataPoints.length > 0;
    const hasEnoughDataForCalc = dataPoints.length >= 2;
    const hasResults = calculatedResults && typeof calculatedResults.mean === 'number' && isFinite(calculatedResults.mean);

    if (calculateButton) calculateButton.disabled = !hasEnoughDataForCalc;
    if (plotHistButton) plotHistButton.disabled = !hasData;
    if (plotBoxButton) plotBoxButton.disabled = !hasData;
    if (plotEquityButton) plotEquityButton.disabled = !hasData;
    if (plotQqButton) plotQqButton.disabled = !hasEnoughDataForCalc;
    if (exportResultsButton) exportResultsButton.disabled = !hasResults; 
    if (clearListButton) clearListButton.disabled = !hasData;
}


function calculateMetrics() {
    console.log("Attempting to calculate metrics..."); 
    if (dataPoints.length < 2) {
        Swal.fire(_t('warning_title'), _t('status_need_data_calc'), 'warning');
        updateStatus('status_need_data_calc', {}, 'warning');
        resetResultsDisplay(); 
        const countSpan = document.getElementById('result-count');
        if (countSpan) countSpan.textContent = formatNumber(dataPoints.length, 0);
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
            updateStatus('status_rf_error', {}, 'error');
            rfRateInput.focus(); rfRateInput.select();
            resetResultsDisplay(); 
            updateActionButtonsState();
            return;
        }
        const rf = rfRaw;
        calculatedResults['rf'] = rf;

        const data = dataPoints.filter(p => isFinite(p));
        const n = data.length;
        calculatedResults['n'] = n;
        calculatedResults['data'] = data; 
        console.log(`Filtered data points for calculation: ${n}`);

        if (n < 2) {
            Swal.fire(_t('warning_title'), _t('status_need_data_calc'), 'warning');
            updateStatus('status_need_data_calc', {}, 'warning');
            resetResultsDisplay();
            document.getElementById('result-count').textContent = formatNumber(n, 0); 
            updateActionButtonsState();
            return;
        }

        calculatedResults['mean'] = calculateMean(data);
        calculatedResults['std'] = calculateStdDev(data);
        calculatedResults['var'] = (calculatedResults.std !== null && !isNaN(calculatedResults.std)) ? Math.pow(calculatedResults.std, 2) : NaN;
        calculatedResults['median'] = calculatePercentile(data, 50); 
        calculatedResults['gm'] = calculateGeometricMean(data);
        calculatedResults['dsd'] = calculateDownsideDeviation(data, 0);
        calculatedResults['cv'] = (calculatedResults.mean !== null && !isNaN(calculatedResults.mean) && Math.abs(calculatedResults.mean) > 1e-9 && calculatedResults.std !== null && !isNaN(calculatedResults.std)) ? calculatedResults.std / Math.abs(calculatedResults.mean) : NaN; 
        const mddResult = calculateMaxDrawdown(data);
        calculatedResults['mdd'] = mddResult.maxDrawdown;
        calculatedResults['mdd_period'] = mddResult.duration;
        let sk = NaN, ku = NaN;
        if (typeof ss !== 'undefined') {
            if (n >= 3 && !isNaN(calculatedResults.std) && calculatedResults.std > 1e-9) {
                try { sk = ss.sampleSkewness(data); } catch (e) { console.warn("Skewness calc failed:", e); }
                try { ku = ss.sampleKurtosis(data); } catch (e) { console.warn("Kurtosis calc failed:", e); }
            } else if (n > 0 && (!isNaN(calculatedResults.std) && calculatedResults.std <= 1e-9)) {
                sk = 0.0; 
                ku = -3.0; 
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
            } else if (calculatedResults.dsd === 0) { 
                 sortino = (calculatedResults.mean - rf > 1e-9) ? Infinity : ((calculatedResults.mean - rf < -1e-9) ? -Infinity : 0);
            }
        }
        calculatedResults['so'] = sortino;

        // Calculate CVaR 5% (Expected Shortfall)
        let cvar5 = NaN;
        if (calculatedResults.var5 !== null && !isNaN(calculatedResults.var5) && n > 0) {
            const shortfallReturns = data.filter(r => r <= calculatedResults.var5);
            if (shortfallReturns.length > 0) {
                cvar5 = calculateMean(shortfallReturns);
            } else {
                // This case should be rare if var5 is derived from the data itself
                // If var5 is the minimum value, CVaR5 is that minimum value.
                cvar5 = calculatedResults.var5;
            }
        }
        calculatedResults['cvar5'] = cvar5;

        // Calculate Omega Ratio (Threshold: Risk-Free Rate)
        let omega = NaN;
        if (n > 0) {
            const gains = data.filter(r => r > rf).reduce((sum, r) => sum + (r - rf), 0);
            const losses = data.filter(r => r < rf).reduce((sum, r) => sum + (rf - r), 0);

            if (losses === 0) {
                omega = (gains > 0) ? Infinity : 1; // Or NaN, or some large number. Convention: 1 if no gains/losses, Infinity if gains but no losses.
            } else {
                omega = gains / losses;
            }
        }
        calculatedResults['omega'] = omega;


        console.log("Calculations complete. Results:", calculatedResults); 

        updateResultsUI();
        updateActionButtonsState(); 
        updateStatus('status_calc_done', {}, 'success');

    } catch (error) {
        console.error("Error during calculation:", error);
        Swal.fire(_t('error_title'), _t('status_calc_error', { error: error.message }), 'error');
        updateStatus('status_calc_error', { error: error.message }, 'error');
        resetResultsDisplay(); 
        updateActionButtonsState();
    }
}


function updateResultsUI() {
    console.log("Updating results UI with:", calculatedResults); 
    const results = calculatedResults;
    if (!results || typeof results.n !== 'number') {
        console.warn("updateResultsUI called but calculatedResults seems empty or invalid.");
        resetResultsDisplay(); 
        return;
    }

    const formatOpt = (digits, percent) => ({ digits: digits, addPercent: percent });
    const updateSpan = (id, value, options, highlight = 'neutral') => {
        const span = document.getElementById(id);
        if (span) {
            const formattedValue = formatNumber(value, options?.digits, options?.addPercent);
            span.textContent = formattedValue;
            span.classList.remove('text-dark-text-muted', 'text-highlight-pos', 'text-highlight-neg', 'text-highlight-neutral', 'text-dark-text');

            if (formattedValue !== _t('na_value')) {
                 if (highlight === 'pos' && value > 0) span.classList.add('text-highlight-pos');
                 else if (highlight === 'neg' && value < 0) span.classList.add('text-highlight-neg');
                 else if (highlight === 'neutral') span.classList.add('text-highlight-neutral');
                 else if (highlight === 'posneg') span.classList.add(value >= 0 ? 'text-highlight-pos' : 'text-highlight-neg');
                 else span.classList.add('text-dark-text'); 
            } else {
                span.classList.add('text-dark-text-muted'); 
            }
        } else {
            console.warn(`Result span not found: ${id}`);
        }
    };

    updateSpan('result-count', results.n, formatOpt(0, false), null); 
    updateSpan('result-mean', results.mean, formatOpt(2, true), 'posneg');
    updateSpan('result-gm', results.gm, formatOpt(2, true), 'posneg');
    updateSpan('result-std', results.std, formatOpt(2, true), 'neutral'); 
    updateSpan('result-dsd', results.dsd, formatOpt(2, true), 'neutral'); 
    updateSpan('result-var', results.var, formatOpt(4, false), null); 
    updateSpan('result-cv', results.cv, formatOpt(3, false), 'neutral'); 
    updateSpan('result-mdd', results.mdd, formatOpt(2, true), 'neg'); 
    updateSpan('result-mdd-period', results.mdd_period, formatOpt(0, false), null);
    updateSpan('result-skew', results.skew, formatOpt(3, false), 'posneg'); 
    updateSpan('result-kurt', results.kurt, formatOpt(3, false), 'neutral'); 
    const normSpan = document.getElementById('result-normality'); if (normSpan) {normSpan.textContent = _t('na_value'); normSpan.className = 'font-mono text-dark-text-muted';} 
    updateSpan('result-var5', results.var5, formatOpt(2, true), 'neg'); 
    updateSpan('result-var95', results.var95, formatOpt(2, true), 'pos'); 
    updateSpan('result-max-gain', results.max_gain, formatOpt(2, true), 'pos');
    updateSpan('result-sharpe', results.sh, formatOpt(3, false), 'neutral'); 
    updateSpan('result-sortino', results.so, formatOpt(3, false), 'neutral'); 
    updateSpan('result-cvar5', results.cvar5, formatOpt(2, true), 'neg');
    updateSpan('result-omega', results.omega, formatOpt(3, false), 'neutral');
}


const DARK_BACKGROUND_COLOR = '#111827'; // From Tailwind config: dark-bg
const DARK_CARD_COLOR = '#1f2937';       // From Tailwind config: dark-card
const DARK_TEXT_COLOR = '#d1d5db';       // From Tailwind config: dark-text
const DARK_MUTED_COLOR = '#9ca3af';      // From Tailwind config: dark-text-muted
const DARK_BORDER_COLOR = '#374151';     // From Tailwind config: dark-border
const PRIMARY_COLOR = '#3b82f6';         // From Tailwind config: dark-primary (blue-500)
const ACCENT_COLOR_NEG = '#f87171';      // From Tailwind config: highlight-neg (red-400)
const ACCENT_COLOR_POS = '#34d399';      // From Tailwind config: highlight-pos (emerald-400)
const ACCENT_COLOR_MEAN = '#fbbf24';     // From Tailwind config: highlight-neutral (amber-400)
const ACCENT_COLOR_MEDIAN = '#60a5fa';   // Tailwind blue-400
const ACCENT_COLOR_FIT = '#a78bfa';      // Tailwind violet-400
const ACCENT_COLOR_KDE = '#14b8a6';      // Tailwind teal-500
const ACCENT_COLOR_EQUITY = '#22c55e';   // Tailwind green-500

// New distinct colors for histogram lines
const HIST_NORM_FIT_COLOR = '#673ab7'; // User requested purple (was Tailwind pink-400)
const HIST_KDE_COLOR = '#818cf8';      // Tailwind indigo-400 (for KDE)
const HIST_MEAN_LINE_COLOR = '#facc15';  // Tailwind yellow-400 (brighter mean)
const HIST_MEDIAN_LINE_COLOR = '#38bdf8'; // Tailwind sky-400 (for Median)
const HIST_VAR_LINE_COLOR = '#f87171';   // Tailwind red-400 (already highlight-neg, good for VaR)
const HIST_GAIN_LINE_COLOR = '#34d399';  // Tailwind emerald-400 (already highlight-pos, good for Gain)


// --- Responsive Plotting Parameters ---
function getResponsiveLayoutParams() {
    const isMobile = window.innerWidth < 768;
    const baseFontSize = isMobile ? 9 : 11; // Slightly smaller base for more professional look
    return {
        baseFontSize: baseFontSize,
        titleFontSize: isMobile ? 13 : 16,
        margin: isMobile ? { l: 40, r: 10, t: 35, b: 50 } : { l: 50, r: 20, t: 40, b: 50 }, // Adjusted margins
        legend: {
            font: { size: baseFontSize }, // Legend font same as base
            x: isMobile ? 0.5 : 1.02, 
            y: isMobile ? -0.35 : 0.98, // Adjust y for mobile legend to be further down
            xanchor: isMobile ? 'center' : 'left',
            yanchor: isMobile ? 'top' : 'top',
            orientation: isMobile ? 'h' : 'v',
            bgcolor: 'rgba(31, 41, 55, 0.7)', // dark-card with some transparency for legend
            bordercolor: DARK_BORDER_COLOR,
            borderwidth: 1,
            itemclick: "toggleothers", // Click one item, others fade
            itemdoubleclick: "toggle", // Double click to isolate
        },
        nbinsxHist: (n) => Math.min(Math.max(10, Math.floor(window.innerWidth / (isMobile ? 30 : 40))), Math.ceil(n/1.5)+1, isMobile ? 25 : 40), // More bins potentially
        markerSize: isMobile ? 4 : 5, // Slightly smaller markers
        lineWidth: isMobile ? 1.5 : 1.8, // Consistent line width
        tickAngle: isMobile ? 30 : 'auto', 
        showlegendHistEquity: true, // Always attempt to show legend now
    };
}

function plotActionWrapper(plotFunc, titleKey) {
    console.log(`Plot action triggered for: ${titleKey}`);
    if (dataPoints.length === 0) {
        Swal.fire(_t('warning_title'), _t('status_need_data_plot'), 'warning');
        updateStatus('status_need_data_plot', {}, 'warning'); return;
    }
    const currentFiniteData = dataPoints.filter(p => isFinite(p));
    if (Object.keys(calculatedResults).length === 0 || !calculatedResults.data || calculatedResults.n !== currentFiniteData.length) {
        console.log("Results are missing or data changed, recalculating before plotting...");
        const minPoints = (titleKey === 'plot_qq_title' ? 2 : 1);
         if (currentFiniteData.length < minPoints) {
             const msgKey = (minPoints === 2) ? 'status_need_data_calc' : 'status_need_data_plot';
             Swal.fire(_t('warning_title'), _t(msgKey), 'warning');
             updateStatus(msgKey, {}, 'warning');
             return;
         }
        calculateMetrics();
        if (!calculatedResults.data || calculatedResults.data.length < (titleKey === 'plot_qq_title' ? 2 : 1)) {
             console.log("Plot cancelled: metric calculation failed or resulted in insufficient valid data.");
             return; 
         }
    }

    const dataToPlot = calculatedResults.data; 
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
        const { plotData, layout } = plotFunc(dataToPlot); 
        if (!plotData || !layout) throw new Error(_t('plotFailed'));

        layout.autosize = true; 
        layout.uirevision = 'dataset'; // Preserve zoom/pan on data update

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
                 scale: 1 
            }
        };

        console.log("Rendering plot with Plotly...");
        Plotly.newPlot(plotContainer, plotData, layout, config).then(() => {
            console.log("Plot rendered successfully.");
            if (plotModal) {
                 window.removeEventListener('keydown', escapeKeyHandler);
                 plotModal.removeEventListener('click', backdropClickHandler);
                 plotModal.addEventListener('click', backdropClickHandler);
                 window.addEventListener('keydown', escapeKeyHandler);

                 plotModal.classList.remove('hidden');
                 plotModal.classList.add('flex'); 
                 document.body.style.overflow = 'hidden'; 
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
         if(plotModal) {
             plotModal.classList.add('hidden');
             plotModal.classList.remove('flex');
         }
         document.body.style.overflow = 'auto'; 
    }
}

function plotHistogramLogic(data) {
    if (data.length === 0) throw new Error(_t('noDataPlot'));
    const responsiveParams = getResponsiveLayoutParams();
    const n = data.length;
    const mean = calculatedResults.mean ?? calculateMean(data);
    const median = calculatedResults.median ?? calculatePercentile(data, 50);
    const std = calculatedResults.std ?? calculateStdDev(data);
    const var_5 = calculatedResults.var5 ?? calculatePercentile(data, 5); // VaR 5%
    const var_95 = calculatedResults.var95 ?? calculatePercentile(data, 95); // Gain 95%

    const nbins = responsiveParams.nbinsxHist(n);

    const traceHist = {
        x: data,
        type: 'histogram',
        name: _t('hist_label_main'), // "داده‌های بازده"
        histnorm: 'probability density', // Normalize for comparison with PDF curves
        autobinx: false,
        nbinsx: nbins,
        marker: {
            color: PRIMARY_COLOR,
            line: { color: DARK_BORDER_COLOR, width: 0.5 }
        },
        opacity: 0.7, // Slightly more opaque
        hoverlabel: { bgcolor: DARK_BACKGROUND_COLOR, bordercolor: PRIMARY_COLOR, font: { color: DARK_TEXT_COLOR, family: 'Vazirmatn, sans-serif' } },
        hovertemplate: `${_t('hist_hover_value')}: %{x:.2f}%<br>${_t('plot_ylabel_hist')}: %{y:.4f}<extra></extra>` // ylabel_hist implies density
    };

    const plotData = [traceHist];
    const shapes = [];
    const annotations = []; // For custom legend items if needed

    // Normal Distribution Curve
    if (n > 1 && !isNaN(mean) && !isNaN(std) && std > 1e-9) {
        const xMin = Math.min(...data);
        const xMax = Math.max(...data);
        const range = xMax - xMin;
        const xNorm = [];
        const yNormPDF = [];
        const step = range / 200 || 0.05; // Finer steps for smoother curve
        const numStdDevsForRange = 3.5; // Extend curve slightly beyond 3 std devs or data range

        let curveStartX = Math.min(xMin, mean - numStdDevsForRange * std);
        let curveEndX = Math.max(xMax, mean + numStdDevsForRange * std);
        if (range === 0) { // Handle case with all same data points
            curveStartX = mean - 1;
            curveEndX = mean + 1;
        }


        for (let x = curveStartX; x <= curveEndX; x += step) {
            xNorm.push(x);
            yNormPDF.push((1 / (std * Math.sqrt(2 * Math.PI))) * Math.exp(-Math.pow(x - mean, 2) / (2 * Math.pow(std, 2))));
        }
        plotData.push({
            x: xNorm,
            y: yNormPDF,
            type: 'scatter',
            mode: 'lines',
            name: _t('plot_norm_label', { mean: formatNumber(mean, 2), std: formatNumber(std, 2) }),
            line: { color: HIST_NORM_FIT_COLOR, dash: 'dashdot', width: responsiveParams.lineWidth },
            hoverinfo: 'name' // Simpler hover for curves
        });
    }

    // Kernel Density Estimation (KDE)
    if (n > 1 && typeof ss !== 'undefined' && typeof ss.kernelDensityEstimation === 'function') {
        try {
            const kdePoints = ss.kernelDensityEstimation(data, 'gaussian', 'silverman'); // Using simple-statistics
            const xKde = kdePoints.map(p => p[0]);
            const yKde = kdePoints.map(p => p[1]);
            if (xKde.length > 0 && yKde.length > 0) {
                plotData.push({
                    x: xKde,
                    y: yKde,
                    type: 'scatter',
                    mode: 'lines',
                    name: _t('plot_kde_label'), // "تخمین چگالی (KDE)"
                    line: { color: HIST_KDE_COLOR, width: responsiveParams.lineWidth, dash: 'longdash' },
                    hoverinfo: 'name'
                });
            }
        } catch (kdeError) {
            console.warn("Error calculating KDE:", kdeError);
        }
    }
    
    // Vertical lines for mean, median, VaR
    const addVerticalLine = (value, color, dash, name, nameShort = name) => {
        if (!isNaN(value) && isFinite(value)) {
            shapes.push({
                type: 'line', x0: value, x1: value, y0: 0, y1: 1, yref: 'paper',
                line: { color: color, width: responsiveParams.lineWidth, dash: dash },
                name: nameShort // Store short name for potential custom legend
            });
            // Add a dummy trace for Plotly's native legend
            plotData.push({
                x: [null], y: [null], mode: 'lines', name: name, legendgroup: nameShort,
                line: { color: color, width: responsiveParams.lineWidth + 2, dash: dash } // Make legend line thicker
            });
        }
    };

    addVerticalLine(mean, HIST_MEAN_LINE_COLOR, 'solid', _t('plot_mean_val_label', { val: formatNumber(mean, 2) }), _t('mean_label'));
    addVerticalLine(median, HIST_MEDIAN_LINE_COLOR, 'dash', _t('plot_median_val_label', { val: formatNumber(median, 2) }), _t('median_label'));
    if (!isNaN(var_5)) {
      addVerticalLine(var_5, HIST_VAR_LINE_COLOR, 'dot', _t('plot_var_label', { val: formatNumber(var_5, 2) }), _t('var_label'));
    }
    if (!isNaN(var_95)) {
      addVerticalLine(var_95, HIST_GAIN_LINE_COLOR, 'dot', _t('plot_gain_label', { val: formatNumber(var_95, 2) }), _t('var_95_label'));
    }
    // Add lines for Standard Deviations
    if (!isNaN(mean) && !isNaN(std) && std > 1e-9) {
        const stdDevLines = [
            { val: mean + std, name: `+1σ (${formatNumber(mean + std, 2)}%)`, color: DARK_MUTED_COLOR, dash: 'dot' },
            { val: mean - std, name: `-1σ (${formatNumber(mean - std, 2)}%)`, color: DARK_MUTED_COLOR, dash: 'dot' },
            { val: mean + 2 * std, name: `+2σ (${formatNumber(mean + 2 * std, 2)}%)`, color: DARK_MUTED_COLOR, dash: 'longdot' },
            { val: mean - 2 * std, name: `-2σ (${formatNumber(mean - 2 * std, 2)}%)`, color: DARK_MUTED_COLOR, dash: 'longdot' },
        ];
        stdDevLines.forEach(line => {
             if (!isNaN(line.val) && isFinite(line.val)) {
                shapes.push({
                    type: 'line', x0: line.val, x1: line.val, y0: 0, y1: 1, yref: 'paper',
                    line: { color: line.color, width: responsiveParams.lineWidth - 0.5, dash: line.dash, opacity: 0.8 },
                    name: line.name
                });
                // Add to legend - these might clutter it, consider annotations or grouped legend
                 plotData.push({
                    x: [null], y: [null], mode: 'lines', name: line.name, legendgroup: 'std_devs',
                    line: { color: line.color, width: responsiveParams.lineWidth +1, dash: line.dash }
                });
            }
        });
    }


    const layout = {
        title: { text: _t('plot_hist_title'), font: { size: responsiveParams.titleFontSize, color: DARK_TEXT_COLOR, family: 'Vazirmatn, sans-serif' }, x: 0.5, xanchor: 'center' },
        xaxis: {
            title: { text: _t('plot_xlabel'), font: { size: responsiveParams.baseFontSize, color: DARK_TEXT_COLOR, family: 'Vazirmatn, sans-serif' } },
            color: DARK_TEXT_COLOR,
            gridcolor: DARK_BORDER_COLOR,
            zerolinecolor: DARK_MUTED_COLOR,
            zeroline: false, // Keep to false, or true if it makes sense with data scale
            showgrid: true,
            tickformat: ',.1f', // Show one decimal place for x-axis ticks
            tickfont: { size: responsiveParams.baseFontSize - 1, color: DARK_TEXT_COLOR, family: 'Vazirmatn, sans-serif' },
            tickangle: responsiveParams.tickAngle
        },
        yaxis: {
            title: { text: _t('plot_ylabel_hist_density'), font: { size: responsiveParams.baseFontSize, color: DARK_TEXT_COLOR, family: 'Vazirmatn, sans-serif' } }, // Density
            color: DARK_TEXT_COLOR,
            gridcolor: DARK_BORDER_COLOR,
            zeroline: false,
            showgrid: true,
            tickfont: { size: responsiveParams.baseFontSize - 1, color: DARK_TEXT_COLOR, family: 'Vazirmatn, sans-serif' }
        },
        plot_bgcolor: DARK_CARD_COLOR,
        paper_bgcolor: DARK_BACKGROUND_COLOR,
        font: { color: DARK_TEXT_COLOR, family: 'Vazirmatn, sans-serif', size: responsiveParams.baseFontSize },
        showlegend: true, // Let Plotly handle the legend by default
        legend: {
            ...responsiveParams.legend, // Spread responsive legend params
            traceorder: 'normal', // Order legend items as they appear in plotData
            itemsizing: 'constant',
            // Group related items if possible (e.g. all std dev lines)
            // legendgroup: 'group_name' in traces can help with this.
        },
        shapes: shapes,
        bargap: 0.05, // Gap between bars of the histogram
        barmode: 'overlay', // Overlay histogram with density curves
        margin: responsiveParams.margin,
        annotations: annotations, // Use if custom legend/annotations are needed beyond Plotly's default
        hovermode: 'x unified' // Improved hover interactions
    };
    
    return { plotData, layout };
}

function plotBoxplotLogic(data) {
    if (data.length === 0) throw new Error(_t('noDataPlot'));
    const responsiveParams = getResponsiveLayoutParams();
    
    const traceBox = {
        y: data,
        type: 'box',
        name: ' ', // No name needed for a single box plot trace usually
        boxpoints: 'all', // 'outliers', false, or 'all' (shows all points if few, outliers if many)
        jitter: 0.3,      // Spread for points if shown
        pointpos: -1.8,   // Position of points relative to box (can be adjusted)
        marker: {
            color: PRIMARY_COLOR, // Color for individual points if shown
            size: responsiveParams.markerSize -1, // Slightly smaller for box plot points
            opacity: 0.6,
            line: { color: DARK_BORDER_COLOR, width: 0.5 } // Border for markers
        },
        line: { 
            color: DARK_TEXT_COLOR, // Color of the box median line
            width: responsiveParams.lineWidth
        },
        fillcolor: 'rgba(59, 130, 246, 0.3)', // Fill color of the box
        hoverinfo: 'y', // Let hovertemplate handle details
        hovertemplate: 
            `<b>${_t('boxplot_hover_stats')}</b><br>` + 
            `${_t('boxplot_hover_max')}: %{customdata[0]:.2f}%<br>` + // Max (upper fence)
            `${_t('boxplot_hover_q3')}: %{q3:.2f}%<br>` +    
            `${_t('boxplot_hover_median')}: %{median:.2f}%<br>` + 
            `${_t('boxplot_hover_q1')}: %{q1:.2f}%<br>` +    
            `${_t('boxplot_hover_min')}: %{customdata[1]:.2f}%<br>` + // Min (lower fence)
            `${_t('boxplot_hover_mean')}: %{customdata[2]:.2f}%<br>` + // Mean
            `${_t('boxplot_hover_std')}: %{customdata[3]:.2f}%<br>` + // Std Dev
            `<extra></extra>`, 
        boxmean: 'sd', // Show mean and standard deviation visually
        whiskerwidth: 0.6, // Adjust whisker width relative to box
        // Customdata to pass values for hovertemplate if Plotly doesn't provide them directly in %{...}
        // This requires calculating these values beforehand and passing them.
        // For box plots, Plotly provides q1, median, q3. Max/Min are yMax/yMin (fences).
        // We might need to calculate mean and std separately if not directly available in hover.
        // Let's assume for now Plotly's internal calculations for q1, median, q3 are sufficient.
        // For yMax/yMin, Plotly uses upperfence and lowerfence internally. We can try to use those.
        // If direct fence values are not in hover, we might need to calculate them: 
        // Q3 + 1.5*IQR and Q1 - 1.5*IQR, capped by actual data min/max.
        // For simplicity, we'll try to use what Plotly offers and if not available, show N/A or calculate if essential.
        // Update: Plotly uses ymax, ymin, q1, median, q3. We need to pass mean and std dev via customdata.
        customdata: [ // This will be an array of arrays, one inner array per y-value (data point)
                      // For a single box plot, we pass one set of aggregated stats for the hovertemplate.
                      // This approach is tricky for box plot's aggregated hover. 
                      // A better way for aggregated hover is to construct it from available %{q1}, %{median} etc.
                      // Let's refine customdata for mean and std if needed.
                        (function() {
                            const mean = calculateMean(data);
                            const std = calculateStdDev(data);
                            const q1 = calculatePercentile(data, 25);
                            const q3 = calculatePercentile(data, 75);
                            const iqr = q3 - q1;
                            const upperFence = q3 + 1.5 * iqr;
                            const lowerFence = q1 - 1.5 * iqr;
                            const dataMax = Math.max(...data);
                            const dataMin = Math.min(...data);
                            return [[ // Only one set of custom data for the single box plot
                                Math.min(dataMax, upperFence), // effective max for hover
                                Math.max(dataMin, lowerFence), // effective min for hover
                                mean,
                                std
                            ]];
                        })()
                    ],
    };

    const plotData = [traceBox];

    const layout = {
        title: { 
            text: _t('plot_box_title'), 
            font: { size: responsiveParams.titleFontSize, color: DARK_TEXT_COLOR, family: 'Vazirmatn, sans-serif' }, 
            x: 0.5, 
            xanchor: 'center' 
        },
        yaxis: {
            title: { text: _t('plot_ylabel_box'), font: { size: responsiveParams.baseFontSize, color: DARK_TEXT_COLOR, family: 'Vazirmatn, sans-serif' } },
            color: DARK_TEXT_COLOR,
            gridcolor: DARK_BORDER_COLOR,
            zerolinecolor: DARK_MUTED_COLOR,
            zeroline: true,
            showgrid: true,
            tickformat: ',.1f', 
            tickfont: { size: responsiveParams.baseFontSize - 1, color: DARK_TEXT_COLOR, family: 'Vazirmatn, sans-serif' }
        },
        xaxis: {
            showticklabels: false,
            zeroline: false,
            showgrid: false
        },
        plot_bgcolor: DARK_CARD_COLOR,
        paper_bgcolor: DARK_BACKGROUND_COLOR,
        font: { color: DARK_TEXT_COLOR, family: 'Vazirmatn, sans-serif', size: responsiveParams.baseFontSize },
        showlegend: false, 
        margin: responsiveParams.margin
    };

    return { plotData, layout };
}

function plotEquityCurveLogic(data) {
    if (data.length === 0) throw new Error(_t('noDataPlot'));
    const responsiveParams = getResponsiveLayoutParams();
    const initialInvestment = 100; // Start with 100 for easier percentage understanding

    const equityCurve = [initialInvestment];
    let highWaterMark = initialInvestment;
    const highWaterMarkData = [initialInvestment];
    const drawdowns = [0]; // Percentage drawdown from HWM

    for (let i = 0; i < data.length; i++) {
        const currentReturn = data[i];
        const previousValue = equityCurve[equityCurve.length - 1];
        const newValue = previousValue * (1 + (isFinite(currentReturn) ? currentReturn : 0) / 100.0);
        equityCurve.push(newValue);

        if (newValue > highWaterMark) {
            highWaterMark = newValue;
        }
        highWaterMarkData.push(highWaterMark);
        drawdowns.push(((newValue / highWaterMark) - 1) * 100); // DD as negative percentage
    }

    const indices = Array.from({ length: equityCurve.length }, (_, i) => i); // 0 to data.length

    // Calculate MDD visual cues
    const mddResult = calculateMaxDrawdown(data); // Assuming this returns peakIndex, troughIndex (0-based on data)
    const mddShapes = [];
    if (mddResult && typeof mddResult.peakIndex === 'number' && typeof mddResult.troughIndex === 'number' && mddResult.duration > 0) {
        // Indices from calculateMaxDrawdown are for the 'data' array (returns), 
        // but our equityCurve has one more point (initialInvestment at index 0).
        // So, peak on equity curve is mddResult.peakIndex, trough is mddResult.troughIndex + 1.
        // The x-values for shapes should correspond to the 'indices' array.
        const mddPeakX = indices[mddResult.peakIndex]; // Peak occurs *before* the drop starts
        const mddTroughX = indices[mddResult.troughIndex + 1]; // Trough is after the full drop period
        
        if (mddPeakX !== undefined && mddTroughX !== undefined) {
            mddShapes.push({
                type: 'rect',
                xref: 'x',
                yref: 'paper', // Relative to y-axis paper
                x0: mddPeakX,
                y0: 0,
                x1: mddTroughX,
                y1: 1,
                fillcolor: 'rgba(248, 113, 113, 0.15)', // Light red (red-300 with opacity)
                layer: 'below',
                line: { width: 0 },
                name: _t('mdd_period_label')
            });
        }
    }

    const plotData = [];

    // Equity Curve Trace
    plotData.push({
        x: indices,
        y: equityCurve,
        type: 'scatter',
        mode: 'lines',
        name: _t('equity_curve_label'), // "منحنی ارزش تجمعی"
        line: { color: ACCENT_COLOR_EQUITY, width: responsiveParams.lineWidth + 0.5 }, // Thicker line for primary trace
        hoverinfo: 'x+y',
        hovertemplate: 
            `<b>${_t('period_label')}:</b> %{x}<br>` +
            `<b>${_t('equity_value_label')}:</b> %{y:.2f}<br>` +
            `<b>${_t('hwm_label')}:</b> %{customdata[0]:.2f}<br>` +
            `<b>${_t('drawdown_from_hwm_label')}:</b> %{customdata[1]:.2f}%<extra></extra>`,
        customdata: highWaterMarkData.map((hwm, i) => [hwm, drawdowns[i]]),
        legendgroup: 'equity'
    });

    // High Water Mark Trace
    plotData.push({
        x: indices,
        y: highWaterMarkData,
        type: 'scatter',
        mode: 'lines',
        name: _t('hwm_trace_label'), // "خط بیشترین ارزش (High Watermark)"
        line: { color: ACCENT_COLOR_POS, dash: 'dash', width: responsiveParams.lineWidth - 0.2 },
        hoverinfo: 'skip', // No separate hover for HWM line, info is in main trace
        legendgroup: 'equity'
    });


    const layout = {
        title: { text: _t('plot_equity_title'), font: { size: responsiveParams.titleFontSize, color: DARK_TEXT_COLOR, family: 'Vazirmatn, sans-serif' }, x: 0.5, xanchor: 'center' },
        xaxis: {
            title: { text: _t('plot_xlabel_equity'), font: { size: responsiveParams.baseFontSize, color: DARK_TEXT_COLOR, family: 'Vazirmatn, sans-serif' } },
            color: DARK_TEXT_COLOR,
            gridcolor: DARK_BORDER_COLOR,
            zeroline: false,
            showgrid: true,
            tickfont: { size: responsiveParams.baseFontSize - 1, color: DARK_TEXT_COLOR, family: 'Vazirmatn, sans-serif' },
            tickangle: responsiveParams.tickAngle,
            range: [0, data.length] // Ensure x-axis covers all periods
        },
        yaxis: {
            title: { text: _t('plot_ylabel_equity_value'), font: { size: responsiveParams.baseFontSize, color: DARK_TEXT_COLOR, family: 'Vazirmatn, sans-serif' } }, // "ارزش (شروع از ۱۰۰)"
            color: DARK_TEXT_COLOR,
            gridcolor: DARK_BORDER_COLOR,
            zeroline: false, 
            showgrid: true,
            tickformat: ',',
            tickfont: { size: responsiveParams.baseFontSize - 1, color: DARK_TEXT_COLOR, family: 'Vazirmatn, sans-serif' },
            // autorange: true, // Let Plotly determine range, or set fixed e.g. type: 'log' for log scale
        },
        plot_bgcolor: DARK_CARD_COLOR,
        paper_bgcolor: DARK_BACKGROUND_COLOR,
        font: { color: DARK_TEXT_COLOR, family: 'Vazirmatn, sans-serif', size: responsiveParams.baseFontSize },
        showlegend: true,
        legend: {
            ...responsiveParams.legend,
            // y: isMobile ? -0.3 : 0.98, // Adjust legend y position slightly if needed for equity
        },
        shapes: mddShapes,
        margin: responsiveParams.margin,
        hovermode: 'x unified'
    };
    return { plotData, layout };
}

function plotQqplotLogic(data) {
    if (data.length < 2) throw new Error(_t('status_need_data_calc')); // Or a specific QQ plot message
    if (typeof ss === 'undefined' || typeof ss.probit !== 'function') {
        console.error("simple-statistics (ss.probit) not available for QQ-Plot.");
        throw new Error(_t('error_lib_missing', {lib: 'simple-statistics'})); 
    }
    const responsiveParams = getResponsiveLayoutParams();

    const sortedData = [...data].sort((a, b) => a - b);
    const n = sortedData.length;
    const theoreticalQuantiles = [];
    for (let i = 0; i < n; i++) {
        // Using a common formula for plotting positions (e.g., (i+0.5)/n or Filliben's estimate)
        // Plotly internally might use specific formulas, but for ss.probit we need probabilities.
        const p = (i + 1 - 0.5) / n; // or (i + 0.5) / n; another common one: (i+1-a)/(n-2a+1) with a=0.375 or 0.5
        const safeP = Math.max(1e-9, Math.min(1 - 1e-9, p)); // Ensure p is within (0,1)
        try {
            theoreticalQuantiles.push(ss.probit(safeP));
        } catch (probitError) {
            console.warn(`ss.probit failed for p=${safeP}`, probitError);
            theoreticalQuantiles.push(NaN); // Push NaN if probit fails
        }
    }

    // Filter out any pairs where theoretical quantile is NaN
    const validPairs = sortedData.map((sampleQuantile, i) => ({
        sample: sampleQuantile,
        theoretical: theoreticalQuantiles[i]
    })).filter(pair => isFinite(pair.theoretical) && isFinite(pair.sample));

    if (validPairs.length < 2) {
        console.warn("Not enough valid (finite) quantile pairs for QQ-Plot after filtering.");
        throw new Error(_t('status_qq_insufficient_points'));
    }

    const sampleQ = validPairs.map(p => p.sample);
    const theoreticalQ = validPairs.map(p => p.theoretical);

    const traceScatter = {
        x: theoreticalQ,
        y: sampleQ,
        mode: 'markers',
        type: 'scatter',
        name: _t('qq_data_quantiles_label'), // "چارک‌های داده"
        marker: {
            color: PRIMARY_COLOR,
            size: responsiveParams.markerSize,
            opacity: 0.7,
            line: { color: DARK_BORDER_COLOR, width: 0.5 }
        },
        hovertemplate:
            `<b>${_t('qq_hover_point')}</b><br>` + // "نقطه چارک"
            `${_t('qq_hover_theoretical')}: %{x:.3f}<br>` + // "چارک نظری"
            `${_t('qq_hover_sample')}: %{y:.2f}%<extra></extra>` // "چارک نمونه"
    };

    // Line passing through Q1 and Q3 of the data (robust fit)
    // Or use mean and std if data is assumed to be somewhat normal for the line
    const q1Sample = calculatePercentile(sampleQ, 25);
    const q3Sample = calculatePercentile(sampleQ, 75);
    const q1Theoretical = ss.probit((25 - 0.5)/100); // Prob for 25th percentile
    const q3Theoretical = ss.probit((75 - 0.5)/100); // Prob for 75th percentile
    
    let lineX = [], lineY = [];
    const minTheo = Math.min(...theoreticalQ);
    const maxTheo = Math.max(...theoreticalQ);

    if (isFinite(q1Sample) && isFinite(q3Sample) && isFinite(q1Theoretical) && isFinite(q3Theoretical) && (q3Theoretical - q1Theoretical !== 0)) {
        const slope = (q3Sample - q1Sample) / (q3Theoretical - q1Theoretical);
        const intercept = q1Sample - slope * q1Theoretical;
        lineX = [minTheo, maxTheo];
        lineY = [intercept + slope * minTheo, intercept + slope * maxTheo];
    } else {
        // Fallback to mean/std line if robust line fails (e.g. too few points for percentiles)
        const meanSample = calculateMean(sampleQ);
        const stdSample = calculateStdDev(sampleQ);
        if (!isNaN(meanSample) && !isNaN(stdSample) && stdSample > 1e-9) {
            lineX = [minTheo, maxTheo];
            lineY = [meanSample + minTheo * stdSample, meanSample + maxTheo * stdSample]; 
        } else {
             console.warn("Cannot draw QQ reference line due to invalid stats for robust or mean/std fit.");
        }
    }

    const traceLine = {
        x: lineX,
        y: lineY,
        mode: 'lines',
        type: 'scatter',
        name: _t('qq_norm_ref_line_label'), // "خط مرجع نرمال"
        line: { color: ACCENT_COLOR_NEG, width: responsiveParams.lineWidth, dash: 'dash' },
        hoverinfo: 'name'
    };

    const plotData = [traceScatter];
    if (lineX.length > 0) {
        plotData.push(traceLine);
    }

    const layout = {
        title: { text: _t('plot_qq_title'), font: { size: responsiveParams.titleFontSize, color: DARK_TEXT_COLOR, family: 'Vazirmatn, sans-serif' }, x: 0.5, xanchor: 'center' },
        xaxis: {
            title: { text: _t('plot_qq_xlabel'), font: { size: responsiveParams.baseFontSize, color: DARK_TEXT_COLOR, family: 'Vazirmatn, sans-serif' } }, // "چارک‌های نظری (نرمال)"
            color: DARK_TEXT_COLOR,
            gridcolor: DARK_BORDER_COLOR,
            zeroline: true,
            zerolinecolor: DARK_MUTED_COLOR,
            tickfont: { size: responsiveParams.baseFontSize - 1, color: DARK_TEXT_COLOR, family: 'Vazirmatn, sans-serif' },
            tickangle: responsiveParams.tickAngle,
            // Ensure axis covers the range of theoretical quantiles
            range: [Math.min(-3.5, minTheo - 0.5), Math.max(3.5, maxTheo + 0.5)] 
        },
        yaxis: {
            title: { text: _t('plot_qq_ylabel'), font: { size: responsiveParams.baseFontSize, color: DARK_TEXT_COLOR, family: 'Vazirmatn, sans-serif' } }, // "چارک‌های نمونه (داده)"
            color: DARK_TEXT_COLOR,
            gridcolor: DARK_BORDER_COLOR,
            zeroline: true,
            zerolinecolor: DARK_MUTED_COLOR,
            tickformat: ',.1f', // One decimal place for y-axis ticks
            tickfont: { size: responsiveParams.baseFontSize - 1, color: DARK_TEXT_COLOR, family: 'Vazirmatn, sans-serif' }
        },
        plot_bgcolor: DARK_CARD_COLOR,
        paper_bgcolor: DARK_BACKGROUND_COLOR,
        font: { color: DARK_TEXT_COLOR, family: 'Vazirmatn, sans-serif', size: responsiveParams.baseFontSize },
        showlegend: true,
        legend: responsiveParams.legend,
        margin: responsiveParams.margin,
        hovermode: 'closest' // 'closest' is often good for scatter plots
    };

    return { plotData, layout };
}

function exportResultsToTxtFile() { 
    if (!calculatedResults || typeof calculatedResults.n !== 'number') { 
        Swal.fire(_t('warning_title'), _t('status_no_results'), 'warning');
        updateStatus('status_no_results', {}, 'warning'); return;
    }
    updateStatus('status_saving_results', {}, 'info');
    const lines = [];
    const results = calculatedResults;
    const inputData = dataPoints; 
    const now = new Date();
    const locale = currentLang === 'fa' ? 'fa-IR' : 'en-US';
    const dateTimeFormat = new Intl.DateTimeFormat(locale, { dateStyle: 'short', timeStyle: 'medium' });

    try {
        lines.push(`========== ${_t('app_title')} ==========`);
        lines.push(`${_t('data_count')}: ${formatNumber(results.n, 0)}`); 
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
        lines.push(getResultLine('cvar_label', 'cvar5', {digits:2, addPercent:true}));
        lines.push(getResultLine('omega_label', 'omega', {digits:3, addPercent:false}));

        lines.push("\n" + "=".repeat(50));
        lines.push(`Input Data (${inputData.length} points):`); 
        lines.push("-".repeat(50));
        lines.push(...inputData.map((p, i) => `${formatNumber(i + 1, 0)}. ${formatNumber(p, 4)}%`));
        lines.push("=".repeat(50));

        const outputText = lines.join('\n');
        const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
        const dateStr = now.toISOString().slice(0, 10);
        const filename = `RiskAnalysisResults_${dateStr}.txt`;

        downloadBlob(blob, filename);
        updateStatus('status_saving_txt_success', { filename: filename }, 'success'); 

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
    updateStatus('status_saving_results', {}, 'info'); 
    const results = calculatedResults;
    const inputData = dataPoints;
    const now = new Date();
    const locale = currentLang === 'fa' ? 'fa-IR' : 'en-US';
    const dateTimeFormat = new Intl.DateTimeFormat(locale, { dateStyle: 'short', timeStyle: 'medium' });

    try {
        const rawDataSheetData = [[_t('col_return')]]; 
        inputData.forEach(point => {
            rawDataSheetData.push([point]); 
        });
        const rawDataWorksheet = XLSX.utils.aoa_to_sheet(rawDataSheetData);

        const resultsSheetData = [];
        resultsSheetData.push([_t('app_title')]);
        resultsSheetData.push([`${_t('data_count')}:`, formatNumber(results.n, 0)]);
        resultsSheetData.push([_t('Date', {skipTranslation: true, defaultValue: 'Date'}) + ':', dateTimeFormat.format(now)]); 
        resultsSheetData.push([`${_t('rf_title')}:`, formatNumber(results.rf, 2, true)]);
        resultsSheetData.push([]); 

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
        addResultRow('cvar_label', formatNumber(results.cvar5, 2, true));
        addResultRow('omega_label', formatNumber(results.omega, 3, false));
        
        const resultsWorksheet = XLSX.utils.aoa_to_sheet(resultsSheetData);

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

// --- PDF Export Function (Revised - HTML to Canvas approach) ---
async function exportResultsToPdfFile() {
    if (!calculatedResults || typeof calculatedResults.n !== 'number') {
        Swal.fire(_t('warning_title'), _t('status_no_results'), 'warning');
        updateStatus('status_no_results', {}, 'warning'); return;
    }
    updateStatus('status_saving_results', {}, 'info');

    // --- Check if required libraries are loaded ---
    if (typeof window.jspdf === 'undefined' || typeof window.jspdf.jsPDF === 'undefined' || typeof window.html2canvas === 'undefined') {
        console.error("jsPDF or html2canvas library is not loaded!");
        Swal.fire(_t('error_title'), "کتابخانه های jsPDF یا html2canvas بارگذاری نشده اند.", 'error');
        updateStatus('status_save_error', {}, 'error');
        return;
    }
    
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
    });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10; // Adjust margin as needed
    const contentWidth = pageWidth - margin * 2;
    let pdfCreationError = null; // Flag for errors during PDF generation

    // --- Create a temporary container for HTML report content ---
    const reportContainer = document.createElement('div');
    reportContainer.id = 'temp-pdf-report-container'; // Add an ID for potential cleanup
    reportContainer.style.position = 'absolute';
    reportContainer.style.left = '-9999px'; // Position off-screen
    reportContainer.style.top = '0';
    reportContainer.style.width = '800px'; // Use a fixed width for rendering consistency
    reportContainer.style.padding = '20px';
    reportContainer.style.backgroundColor = '#111827'; // Match dark theme background
    reportContainer.style.color = '#d1d5db'; // Match dark theme text
    reportContainer.style.fontFamily = 'Vazirmatn, sans-serif'; // Apply the font loaded via CSS
    reportContainer.style.direction = 'rtl';
    reportContainer.style.fontSize = '14px';
    reportContainer.style.lineHeight = '1.6';
    // Add basic table styles directly
    reportContainer.innerHTML = `
        <style>
            #temp-pdf-report-container table { width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 15px; }
            #temp-pdf-report-container th, #temp-pdf-report-container td { padding: 5px; border: 1px solid #374151; }
            #temp-pdf-report-container th { background-color: #1f2937; font-weight: bold; text-align: center; }
            #temp-pdf-report-container td:first-child { text-align: right; }
            #temp-pdf-report-container td:last-child { text-align: center; font-family: monospace; }
            #temp-pdf-report-container .data-table { width: 70%; margin-right: auto; margin-left: auto;} /* Center smaller table */
            #temp-pdf-report-container .data-table th, #temp-pdf-report-container .data-table td { text-align: center; }
        </style>
    `;

    try {
        const results = calculatedResults;
        const inputData = dataPoints;
        const now = new Date();
        const locale = currentLang === 'fa' ? 'fa-IR' : 'en-US';
        const dateTimeFormat = new Intl.DateTimeFormat(locale, { dateStyle: 'full', timeStyle: 'medium' });

        // --- Populate HTML content ---
        let htmlContent = `
            <h1 style="text-align: center; font-size: 20px; font-weight: bold; margin-bottom: 15px;">${_t('app_title')}</h1>
            <p style="font-size: 12px; margin-bottom: 5px;">تاریخ گزارش: ${dateTimeFormat.format(now)}</p>
            <hr style="border-color: #374151; margin: 10px 0;">
            
            <h2 style="font-size: 16px; font-weight: bold; margin-top: 15px; margin-bottom: 8px;">${_t('results_title')}</h2>
            <table>
                <thead>
                    <tr><th>${_t('metric_header_pdf')}</th><th>${_t('value_header_pdf')}</th></tr>
                </thead>
                <tbody>
        `;
        // Results rows
        const resultsTableBody = [
             [_t('data_count'), formatNumber(results.n, 0)],
             [_t('rf_title'), formatNumber(results.rf, 2, true)],
             [_t('mean_label'), formatNumber(results.mean, 2, true)],
             [_t('geo_mean_label'), formatNumber(results.gm, 2, true)],
             [_t('std_dev_label'), formatNumber(results.std, 2, true)],
             [_t('downside_dev_label'), formatNumber(results.dsd, 2, true)],
             [_t('variance_label'), formatNumber(results.var, 4, false)],
             [_t('cv_label'), formatNumber(results.cv, 3, false)],
             [_t('mdd_label'), formatNumber(results.mdd, 2, true)],
             [_t('mdd_period_label'), formatNumber(results.mdd_period, 0, false)],
             [_t('skewness_label'), formatNumber(results.skew, 3, false)],
             [_t('kurtosis_label'), formatNumber(results.kurt, 3, false)],
             [_t('var_label'), formatNumber(results.var5, 2, true)],
             [_t('var_95_label'), formatNumber(results.var95, 2, true)],
             [_t('max_gain_label'), formatNumber(results.max_gain, 2, true)],
             [_t('sharpe_label'), formatNumber(results.sh, 3, false)],
             [_t('sortino_label'), formatNumber(results.so, 3, false)],
             [_t('cvar_label'), formatNumber(results.cvar5, 2, true)],
             [_t('omega_label'), formatNumber(results.omega, 3, false)],
        ];
        resultsTableBody.forEach(row => {
            htmlContent += `<tr><td>${row[0]}</td><td>${row[1]}</td></tr>`;
        });
        htmlContent += `</tbody></table>`;

        // Input Data Table
        if (inputData.length > 0) {
            htmlContent += `<h2 style="font-size: 16px; font-weight: bold; margin-top: 20px; margin-bottom: 8px;">داده های ورودی (${inputData.length} نقطه):</h2>
                            <table class="data-table">
                                <thead><tr><th>${_t('col_index')}</th><th>${_t('col_return')}</th></tr></thead>
                                <tbody>`;
            inputData.forEach((p, i) => {
                htmlContent += `<tr><td>${formatNumber(i + 1, 0)}</td><td>${formatNumber(p, 4)}%</td></tr>`;
            });
            htmlContent += `</tbody></table>`;
        }

        // Append the generated HTML to the container
        reportContainer.innerHTML += htmlContent; // Append to keep the styles
        document.body.appendChild(reportContainer);

        // --- Capture HTML content as image ---
        await new Promise(resolve => setTimeout(resolve, 200)); // Slightly longer delay
        
        console.log("Capturing report HTML content with html2canvas...");
        const reportCanvas = await html2canvas(reportContainer, { 
            scale: 2, 
            useCORS: true, 
            backgroundColor: '#111827', // Ensure background for capture
            width: reportContainer.offsetWidth, // Use actual width
            height: reportContainer.offsetHeight, // Use actual height
            scrollX: 0,
            scrollY: -window.scrollY // Important for off-screen elements
        });
        const reportImgData = reportCanvas.toDataURL('image/png');
        console.log("Report HTML content captured.");
        document.body.removeChild(reportContainer); // Clean up immediately after capture

        // --- Check if chart should be included ---
        const plotModalElement = document.getElementById('plotModal');
        const plotContainerElement = document.getElementById('plot-container');
        let includeCharts = false;
        let chartCanvas = null;
        let chartTitle = '';
        if (plotModalElement && plotContainerElement && !plotModalElement.classList.contains('hidden') && plotContainerElement.children.length > 0) {
            const chartConfirmation = await Swal.fire({
                title: _t('info_title'),
                text: _t('include_charts_q'),
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: _t('ok_button'),
                cancelButtonText: _t('cancel_button'),
            });
            includeCharts = chartConfirmation.isConfirmed;
            if (includeCharts) {
                 try {
                     chartTitle = document.getElementById('plotModalLabel')?.textContent || _t('plot_modal_title');
                     console.log("Capturing chart with html2canvas...");
                     await new Promise(resolve => setTimeout(resolve, 300)); 
                     chartCanvas = await html2canvas(plotContainerElement, { 
                         scale: 2, 
                         useCORS: true, 
                         backgroundColor: DARK_BACKGROUND_COLOR // Match plot background
                     });
                     console.log("Chart captured.");
                 } catch(chartError) {
                     console.error("Error capturing chart canvas:", chartError);
                     Swal.fire(_t('error_title'), "خطا در عکس گرفتن از نمودار.", 'error');
                     includeCharts = false; 
                 }
            }
        }
        
        // --- Add captured images to PDF ---
        let currentY = margin;
        
        // Add Report Image
        const reportImgHeightMM = (reportCanvas.height * contentWidth) / reportCanvas.width; 
        let remainingPageHeight = pageHeight - margin - margin; // Usable height
        let reportImgPartHeight = reportCanvas.height; // Height of the source canvas part
        let reportSourceY = 0; // Starting Y position on the source canvas
        
        // Loop to add parts of the report image, handling page breaks
        while (reportImgPartHeight > 0) {
            if (currentY > margin && reportImgPartHeight > remainingPageHeight * (reportCanvas.width / contentWidth) ) { // Check if new page needed and enough content left
                 pdf.addPage();
                 currentY = margin;
                 remainingPageHeight = pageHeight - margin - margin;
            }
            
            // Calculate the height of the chunk to draw on this page (in canvas pixels)
            let chunkHeightCanvas = Math.min(reportImgPartHeight, remainingPageHeight * (reportCanvas.width / contentWidth));
            // Calculate the height of this chunk in PDF mm units
            let chunkHeightMM = (chunkHeightCanvas * contentWidth) / reportCanvas.width;

            // Create a temporary canvas to draw the chunk
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = reportCanvas.width;
            tempCanvas.height = chunkHeightCanvas;
            const tempCtx = tempCanvas.getContext('2d');
            tempCtx.drawImage(reportCanvas, 0, reportSourceY, reportCanvas.width, chunkHeightCanvas, 0, 0, reportCanvas.width, chunkHeightCanvas);
            
            // Add the chunk image to the PDF
            pdf.addImage(tempCanvas.toDataURL('image/png'), 'PNG', margin, currentY, contentWidth, chunkHeightMM);

            // Update positions for the next iteration
            currentY += chunkHeightMM + 5; // Add some spacing
            reportSourceY += chunkHeightCanvas;
            reportImgPartHeight -= chunkHeightCanvas;
            remainingPageHeight = pageHeight - currentY - margin; // Update remaining height
        }


        // Add Chart Image (if included)
        if (includeCharts && chartCanvas) {
            const chartImgData = chartCanvas.toDataURL('image/png');
            const chartImgHeightMM = (chartCanvas.height * contentWidth) / chartCanvas.width;
            
            if (currentY === margin || currentY + chartImgHeightMM + 15 > pageHeight - margin) { // Check if it fits or needs new page (added 15 for title space)
                 if (currentY > margin) pdf.addPage(); // Add page only if not already at the top
                 currentY = margin;
            }
            
            // Optionally add chart title as text
            // This will use the PDF's current font (likely Helvetica if Vazirmatn embedding failed previously)
            // Or, we can try to use a generic sans-serif and hope for the best
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'bold'); // Using a standard font for chart title
            pdf.setTextColor(50, 50, 50); // Dark gray text for better contrast if background is white
            pdf.text(chartTitle, pageWidth / 2, currentY, { align: 'center' }); // Adjust Y for title
            currentY += 10; // Space after title

            // Recalculate if it still fits after adding title
            if (currentY + chartImgHeightMM > pageHeight - margin) {
                 pdf.addPage();
                 currentY = margin;
                 // Re-add title on new page if desired
                 pdf.text(chartTitle, pageWidth / 2, currentY, { align: 'center' });
                 currentY += 10;
            }

            pdf.addImage(chartImgData, 'PNG', margin, currentY, contentWidth, chartImgHeightMM);
        }
        
        // --- Save PDF ---
        const dateStr = now.toISOString().slice(0, 10);
        const filename = `RiskAnalysisResults_${dateStr}.pdf`;
        pdf.save(filename);
        updateStatus('status_saving_pdf_success', { filename: filename }, 'success');

    } catch (error) {
        pdfCreationError = error; // Store error
        console.error("Error exporting results to PDF (HTML to Canvas method):", error);
        Swal.fire(_t('error_title'), _t('file_save_error_msg', { error: error.message }), 'error');
        updateStatus('status_save_error', {}, 'error');
    } finally {
         // Ensure cleanup of the temporary div even if errors occur
         const tempDiv = document.getElementById('temp-pdf-report-container');
         if (tempDiv && tempDiv.parentNode) {
             document.body.removeChild(tempDiv);
         }
         // Re-throw error if caught during PDF generation, after cleanup
         if (pdfCreationError) {
             // Optional: Rethrow or handle further if needed
         }
    }
}

// --- Tooltip & Modal Handlers ---
function initializeSweetAlertTooltips() { 
    document.body.removeEventListener('click', handleTooltipIconClick); // Ensure no multiple listeners
    document.body.addEventListener('click', handleTooltipIconClick);
}
function handleTooltipIconClick(event) { 
    const icon = event.target.closest('.tooltip-icon'); if (!icon) return; event.preventDefault();
    const tooltipKey = icon.getAttribute('data-tooltip-key'); if (!tooltipKey) return; const tooltipText = _t(tooltipKey); if (!tooltipText) return;
    Swal.fire({ title: `<strong class="text-lg font-semibold">${_t('info_title')}</strong>`, html: `<div class="text-sm text-left rtl:text-right leading-relaxed">${tooltipText.replace(/\n/g, '<br>')}</div>`, icon: 'info', confirmButtonText: _t('ok_button'), customClass: { popup: 'swal2-popup', title: 'swal2-title', htmlContainer: 'swal2-html-container', confirmButton: 'swal2-confirm', closeButton: 'swal2-close' }, showCloseButton: true });
}
function closeModal() { 
    if (plotModal) { plotModal.classList.add('hidden'); plotModal.classList.remove('flex'); } document.body.style.overflow = 'auto';
    if (plotContainer) { try { Plotly.purge(plotContainer); } catch (e) { console.error("Error purging plot:", e); }}
    window.removeEventListener('keydown', escapeKeyHandler); if(plotModal) plotModal.removeEventListener('click', backdropClickHandler);
}
function closeModalHandler() { closeModal(); }
function backdropClickHandler(event) { if (event.target === plotModal) closeModal(); }
function escapeKeyHandler(event) { if (event.key === 'Escape') closeModal(); }


function calculateMean(data) { if (!data || data.length === 0) return NaN; const sum = data.reduce((acc, val) => acc + val, 0); return sum / data.length; }
function calculateStdDev(data) { if (!data || data.length < 2) return NaN; const mean = calculateMean(data); if (isNaN(mean)) return NaN; const variance = data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (data.length - 1); return Math.sqrt(variance); }
function calculatePercentile(data, percentile) { if (!data || data.length === 0 || percentile < 0 || percentile > 100) return NaN; const sortedData = [...data].sort((a, b) => a - b); const n = sortedData.length; if (percentile === 0) return sortedData[0]; if (percentile === 100) return sortedData[n - 1]; const index = (percentile / 100) * (n - 1); const lowerIndex = Math.floor(index); const upperIndex = Math.ceil(index); const weight = index - lowerIndex; if (lowerIndex === upperIndex) return sortedData[lowerIndex]; else { const lowerValue = sortedData[lowerIndex] ?? sortedData[0]; const upperValue = sortedData[upperIndex] ?? sortedData[n-1]; return lowerValue * (1 - weight) + upperValue * weight; }}
function calculateGeometricMean(data) { if (!data || data.length === 0) return NaN; let product = 1.0; for (const p of data) { const growthFactor = 1 + p / 100.0; if (growthFactor <= 1e-9) return NaN; product *= growthFactor; } if (product < 0) return NaN; return (Math.pow(product, 1.0 / data.length) - 1.0) * 100.0; }
function calculateDownsideDeviation(data, target = 0) { if (!data || data.length < 2) return NaN; const n = data.length; const downsideReturns = data.filter(r => r < target); if (downsideReturns.length === 0) return 0.0; const sumSqDev = downsideReturns.reduce((acc, r) => acc + Math.pow(r - target, 2), 0); return Math.sqrt(sumSqDev / (n - 1)); }
function calculateMaxDrawdown(returnsPerc) { if (!returnsPerc || returnsPerc.length === 0) return { maxDrawdown: 0.0, duration: 0, peakIndex: 0, troughIndex: 0 }; const dataArr = returnsPerc.filter(p => isFinite(p)); if (dataArr.length === 0) return { maxDrawdown: 0.0, duration: 0, peakIndex: 0, troughIndex: 0 }; let cumulative = [1.0]; dataArr.forEach(r => { cumulative.push(cumulative[cumulative.length - 1] * (1 + r / 100.0)); }); let maxDd = 0.0; let peakIndex = 0; let troughIndex = 0; let currentPeakValue = cumulative[0]; let currentPeakIndex = 0; for (let i = 1; i < cumulative.length; i++) { if (cumulative[i] > currentPeakValue) { currentPeakValue = cumulative[i]; currentPeakIndex = i; } else { const currentDrawdown = (currentPeakValue <= 1e-9) ? 0 : (cumulative[i] / currentPeakValue - 1.0) * 100.0; if (currentDrawdown < maxDd) { maxDd = currentDrawdown; peakIndex = currentPeakIndex; troughIndex = i; }}} const duration = troughIndex - peakIndex; return { maxDrawdown: isFinite(maxDd) ? maxDd : 0.0, duration: isFinite(duration) ? duration : 0, peakIndex: peakIndex, troughIndex: troughIndex };}


document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed");
    const savedLang = localStorage.getItem('preferredLang');
    if (savedLang && langSelect) { 
        langSelect.value = savedLang;
    }
    currentLang = langSelect ? langSelect.value : 'fa'; 
    updateLanguageUI(); 

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
        valueEntry.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && !event.shiftKey) { 
                event.preventDefault(); 
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
         editValueEntry.addEventListener('keydown', (event) => {
             if (event.key === 'Enter') {
                 event.preventDefault(); 
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
        } else { console.warn(`Plot button ${btnInfo.id} not found.`); } 
    });

    if (exportResultsButton) {
        exportResultsButton.addEventListener('click', async () => {
            if (!calculatedResults || typeof calculatedResults.n !== 'number') {
                Swal.fire(_t('warning_title'), _t('status_no_results'), 'warning');
                updateStatus('status_no_results', {}, 'warning'); return;
            }

            const { value: format } = await Swal.fire({
                title: _t('export_format_title'),
                input: 'select',
                inputOptions: {
                    'txt': _t('export_txt'),
                    'excel': _t('export_excel'),
                    // 'pdf': _t('export_pdf') // Removed PDF
                },
                inputPlaceholder: _t('select_option'),
                showCancelButton: true,
                confirmButtonText: _t('ok_button'),
                cancelButtonText: _t('cancel_button'),
                customClass: { popup: 'swal2-popup', title: 'swal2-title', input: 'swal2-input', confirmButton: 'swal2-confirm', cancelButton: 'swal2-cancel'}
            });

            if (format) {
                switch (format) {
                    case 'txt':
                        exportResultsToTxtFile();
                        break;
                    case 'excel':
                        exportResultsToExcelFile();
                        break;
                    // case 'pdf': // Removed PDF
                    //    await exportResultsToPdfFile(); 
                    //    break; // Removed PDF
                    default:
                        console.warn('Unknown export format selected:', format);
                }
            } else {
                updateStatus('status_save_cancel', {}, 'info');
            }
        });
    } else { console.error("Export results button not found"); }


    updateEditControlsState(); 
    updateActionButtonsState(); 
    resetResultsDisplay(); 
    updateStatus('status_ready', {}, 'info'); 
    initializeSweetAlertTooltips(); // KEEP CLICK TOOLTIPS (SWEETALERT)
    setupDragAndDrop(); 

    if (plotModalCloseButton) {
        plotModalCloseButton.addEventListener('click', closeModalHandler);
    } else { console.warn("Plot modal close button not found."); }
    if (plotModal) {
        plotModal.addEventListener('click', backdropClickHandler);
    } else { console.warn("Plot modal element not found."); }
    document.addEventListener('keydown', escapeKeyHandler); 

    console.log("Application initialized.");
});

updateEditOptions();
console.log("script.js loaded and initialized.");
