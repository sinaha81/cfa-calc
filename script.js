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
        'fa': `**میانگین حسابی بازده (Arithmetic Mean Return):**
این شاخص، میانگین ساده بازده‌های مشاهده شده در یک دوره زمانی معین است (مجموع بازده‌ها تقسیم بر تعداد دوره‌ها). محاسبه آن آسان است و نقطه شروعی برای تحلیل بازده فراهم می‌کند.

**کاربرد و ملاحظات برای تحلیلگر مالی (CFA):**
*   **نقطه شروع تحلیل:** اولین برآورد از بازده مرکزی یک دارایی یا سبد در یک دوره مشخص.
*   **حساسیت به داده‌های پرت (Outliers):** بازده‌های بسیار بزرگ یا بسیار کوچک (چه مثبت و چه منفی) می‌توانند میانگین حسابی را به شدت تحت تأثیر قرار داده و تصویر نادرستی از بازده "معمول" ارائه دهند. برای مثال، یک سود بسیار بزرگ در یک دوره می‌تواند میانگین را به طور نامتناسبی بالا ببرد.
*   **عدم نمایش اثر مرکب شدن:** میانگین حسابی، اثر مرکب شدن بازده‌ها در طول زمان (reinvestment of returns) را در نظر نمی‌گیرد. این موضوع به خصوص در افق‌های سرمایه‌گذاری بلندمدت اهمیت پیدا می‌کند.
*   **مقایسه با میانه (Median):** تفاوت قابل توجه بین میانگین حسابی و میانه می‌تواند نشانه‌ای از چولگی (skewness) در توزیع بازده‌ها باشد. اگر میانگین بزرگتر از میانه باشد، معمولاً نشان‌دهنده چولگی مثبت (تعداد بیشتری بازده کوچک و تعداد کمتری بازده بسیار بزرگ) است.
*   **بهترین کاربرد:** برای تخمین بازده مورد انتظار یک دارایی در یک دوره واحد در آینده (با فرض عدم تغییر شرایط بازار و توزیع بازده). همچنین در مدل CAPM برای محاسبه بازده مورد انتظار استفاده می‌شود.
*   **محدودیت:** به تنهایی تصویر کاملی از ریسک یا پایداری بازده‌ها ارائه نمی‌دهد. باید در کنار معیارهای ریسک مانند انحراف معیار و سایر شاخص‌های توزیع بازده بررسی شود.`,
        'en': `**Arithmetic Mean Return:**
This is the simple average of observed returns over a period (sum of returns divided by the number of periods). It's easy to calculate and provides a starting point for return analysis.

**Use & Considerations for CFA Charterholders:**
*   **Starting Point:** Initial estimate of central tendency for an asset or portfolio over a specific period.
*   **Outlier Sensitivity:** Extreme values (very large gains or losses) can heavily skew the mean, providing a distorted picture of "typical" returns. For instance, one very large profit can disproportionately inflate the mean.
*   **No Compounding Effect:** Doesn't reflect the reinvestment of returns over time. This is particularly important for long-term investment horizons.
*   **Comparison with Median:** A significant difference between the arithmetic mean and the median can indicate skewness in the return distribution. If the mean is greater than the median, it often suggests positive skewness (more small returns and fewer very large returns).
*   **Best Use:** Estimating the expected return for a single future period, assuming market conditions and return distribution don't change. Also used in the CAPM for calculating expected return.
*   **Limitation:** Alone, it doesn't provide a complete picture of risk or return sustainability. It should be analyzed alongside risk measures like standard deviation and other return distribution characteristics.`
    },
    'geo_mean_tooltip': {
        'fa': `**میانگین هندسی بازده (Geometric Mean / CAGR):**
میانگین هندسی، نرخ رشد مرکب سالانه (CAGR) یک سرمایه‌گذاری را در طول چند دوره زمانی نشان می‌دهد. این معیار اثر مرکب شدن بازده‌ها را در نظر می‌گیرد، یعنی فرض می‌کند که سودهای حاصل از سرمایه‌گذاری مجدداً سرمایه‌گذاری می‌شوند.

**کاربرد و ملاحظات برای تحلیلگر مالی (CFA):**
*   **ارزیابی عملکرد بلندمدت:** شاخص بسیار مهمی برای ارزیابی عملکرد واقعی و بلندمدت سرمایه‌گذاری‌های پرریسک‌تر است، زیرا نرخ رشد "واقعی" را که سرمایه‌گذار تجربه کرده، نشان می‌دهد.
*   **مقایسه سرمایه‌گذاری‌ها:** برای مقایسه عملکرد سرمایه‌گذاری‌های مختلف در طول زمان، به خصوص اگر افق سرمایه‌گذاری چند دوره باشد، مناسب‌تر از میانگین حسابی است.
*   **همیشه کمتر یا مساوی میانگین حسابی:** میانگین هندسی همیشه کمتر یا مساوی میانگین حسابی همان مجموعه از بازده‌ها خواهد بود (مگر اینکه تمام بازده‌ها یکسان باشند که در این صورت برابر خواهند بود). هرچه نوسان بازده‌ها بیشتر باشد، تفاوت بین این دو میانگین نیز بیشتر خواهد شد.
*   **محاسبه:** حاصلضرب (1+بازده دوره) برای تمام دوره‌ها، به توان (1 تقسیم بر تعداد دوره‌ها)، منهای 1. سپس در 100 ضرب می‌شود تا به درصد تبدیل شود.
*   **محدودیت:** اگر هر یک از بازده‌های دوره 100-% یا کمتر باشد (یعنی ارزش سرمایه‌گذاری صفر یا منفی شود)، محاسبه میانگین هندسی با مشکل مواجه می‌شود یا تعریف نشده است. برای بازده‌های منفی بزرگ باید با احتیاط استفاده شود.
*   **تفسیر:** نشان‌دهنده نرخ رشد یکنواختی است که اگر سرمایه‌گذاری در هر دوره با آن نرخ رشد می‌کرد، در نهایت به همان ارزش پایانی می‌رسید که با بازده‌های واقعی و نوسانی خود رسیده است.`,
        'en': `**Geometric Mean Return (CAGR):**
The geometric mean shows the Compound Annual Growth Rate (CAGR) of an investment over multiple periods. It accounts for the effect of compounding, assuming profits are reinvested.

**Use & Considerations for CFA Charterholders:**
*   **Evaluating Long-Term Performance:** A crucial metric for assessing the true, long-term performance of investments, as it reflects the actual growth rate experienced by the investor.
*   **Comparing Investments:** More appropriate than the arithmetic mean for comparing the performance of different investments over time, especially for multi-period horizons.
*   **Always Less Than or Equal to Arithmetic Mean:** The geometric mean will always be less than or equal to the arithmetic mean of the same set of returns (unless all returns are identical, in which case they are equal). The greater the volatility of returns, the larger the difference between the two means.
*   **Calculation:** The product of (1 + period return) for all periods, raised to the power of (1 divided by the number of periods), minus 1. Then multiplied by 100 for percentage.
*   **Limitation:** If any period return is -100% or less (investment value becomes zero or negative), the geometric mean calculation can be problematic or undefined. Use with caution for large negative returns.
*   **Interpretation:** Represents the constant rate of return that, if achieved in each period, would have resulted in the same final investment value as achieved with the actual, fluctuating returns.`
    },
    'std_dev_tooltip': {
        'fa': `**انحراف معیار بازده (Standard Deviation of Returns):**
یک شاخص آماری کلیدی برای اندازه‌گیری میزان پراکندگی یا نوسان کل بازده‌های یک دارایی یا سبد حول میانگین حسابی آن در یک دوره معین. این شاخص، ریسک کل (Total Risk) سرمایه‌گذاری را نمایندگی می‌کند.

**کاربرد و ملاحظات برای تحلیلگر مالی (CFA):**
*   **معیار اصلی ریسک:** انحراف معیار بالاتر به معنای نوسانات بیشتر و در نتیجه، عدم قطعیت بالاتر در مورد بازده‌های آتی و ریسک بیشتر است. سرمایه‌گذاران ریسک‌گریز، انحراف معیار پایین‌تر را ترجیح می‌دهند (به ازای سطح معینی از بازده).
*   **مقایسه ریسک دارایی‌ها:** برای مقایسه ریسک سرمایه‌گذاری‌های مختلف (با فرض توزیع نرمال یا نزدیک به نرمال بازده‌ها). دارایی با انحراف معیار بالاتر، پرریسک‌تر تلقی می‌شود.
*   **ورودی مدل‌های مالی:** در بسیاری از مدل‌های مالی مانند مدل قیمت‌گذاری دارایی‌های سرمایه‌ای (CAPM)، مدل‌های بهینه‌سازی پورتفولیو (مانند مارکویتز برای ساخت مرز کارا) و محاسبات نسبت شارپ، انحراف معیار یک ورودی اساسی است.
*   **تفسیر در کنار میانگین:** انحراف معیار باید همیشه در کنار میانگین بازده تفسیر شود. ضریب تغییرات (CV) این دو را با هم ترکیب می‌کند تا ریسک به ازای هر واحد بازده را نشان دهد.
*   **محدودیت فرض توزیع نرمال:** انحراف معیار به عنوان معیار ریسک، زمانی بهترین کارایی را دارد که توزیع بازده‌ها تقریباً نرمال (متقارن و زنگوله‌ای شکل) باشد. در صورت وجود چولگی یا کشیدگی قابل توجه، انحراف معیار ممکن است تصویر کاملی از ریسک ارائه ندهد و معیارهای ریسک دیگری مانند انحراف معیار نزولی، VaR یا CVaR ممکن است مناسب‌تر باشند.
*   **ریسک کل:** شامل ریسک سیستماتیک (بازار) و غیرسیستماتیک (خاص شرکت) می‌شود.`,
        'en': `**Standard Deviation of Returns:**
A key statistical measure of the total volatility or dispersion of returns around their arithmetic mean. Represents the Total Risk of an investment.

**Use & Considerations for CFA Charterholders:**
*   **Primary Risk Metric:** Higher standard deviation implies greater volatility, thus higher uncertainty and risk. Risk-averse investors prefer lower standard deviation for a given level of return.
*   **Comparing Asset Risk:** Used to compare the risk of different investments (assuming normal or near-normal return distributions). An asset with a higher standard deviation is considered riskier.
*   **Input for Financial Models:** Essential input for CAPM, portfolio optimization models (e.g., Markowitz for efficient frontier construction), and Sharpe Ratio calculations.
*   **Interpret with Mean:** Should always be considered alongside the mean return. The Coefficient of Variation (CV) combines these to show risk per unit of return.
*   **Normality Assumption Limitation:** Most effective when return distributions are approximately normal. For significant skewness or kurtosis, standard deviation may not fully capture risk, and other risk measures (downside deviation, VaR, CVaR) might be more appropriate.
*   **Total Risk:** Encompasses both systematic (market) risk and unsystematic (firm-specific) risk.`
    },
    'downside_dev_tooltip': {
        'fa': `**انحراف معیار نزولی (Downside Deviation / Semi-Deviation):**
این معیار، نوسانات بازده‌های یک سرمایه‌گذاری را فقط برای دوره‌هایی که بازده از یک آستانه مشخص (معمولاً میانگین بازده، نرخ بدون ریسک، یا صفر) کمتر بوده است، اندازه‌گیری می‌کند. در این تحلیل، آستانه صفر در نظر گرفته شده است، یعنی فقط بازده‌های منفی در محاسبه ریسک دخیل هستند.

**کاربرد و ملاحظات برای تحلیلگر مالی (CFA):**
*   **تمرکز بر ریسک نامطلوب:** بسیاری از سرمایه‌گذاران، نوسانات مثبت (بازده‌های بالاتر از حد انتظار) را "ریسک" تلقی نمی‌کنند. انحراف معیار نزولی فقط بر نوسانات "بد" یا زیان‌آور تمرکز دارد.
*   **مفید برای توزیع‌های غیرمتقارن:** اگر توزیع بازده‌ها چوله باشد (به خصوص چولگی منفی)، انحراف معیار کل ممکن است ریسک واقعی را به درستی نشان ندهد. انحراف معیار نزولی در این موارد تصویر دقیق‌تری از ریسک زیان ارائه می‌دهد.
*   **ورودی نسبت سورتینو:** این معیار در مخرج کسر نسبت سورتینو (Sortino Ratio) استفاده می‌شود که جایگزینی برای نسبت شارپ است و فقط ریسک زیان را جریمه می‌کند.
*   **تعریف آستانه:** انتخاب آستانه (Target Return) مهم است. آستانه صفر به معنای تمرکز بر زیان‌های مطلق است. آستانه‌های دیگر مانند میانگین بازده یا نرخ بدون ریسک نیز قابل استفاده‌اند.
*   **تفاوت با انحراف معیار کل:** اگر توزیع بازده متقارن باشد، انحراف معیار نزولی (با آستانه میانگین) تقریباً نصف انحراف معیار کل خواهد بود. در توزیع‌های چوله، این رابطه برقرار نیست.`,
        'en': `**Downside Deviation (Semi-Deviation):**
Measures the volatility of investment returns only for periods when the return was less than a specified target (usually the mean return, risk-free rate, or zero). In this analysis, the target is zero, meaning only negative returns contribute to the risk calculation.

**Use & Considerations for CFA Charterholders:**
*   **Focus on Undesirable Risk:** Many investors do not perceive positive volatility (returns higher than expected) as "risk." Downside deviation focuses only on "bad" or loss-making volatility.
*   **Useful for Asymmetric Distributions:** If return distributions are skewed (especially negatively skewed), standard deviation may not accurately reflect true risk. Downside deviation provides a more accurate picture of loss risk in such cases.
*   **Input for Sortino Ratio:** This metric is used in the denominator of the Sortino Ratio, an alternative to the Sharpe Ratio that only penalizes downside risk.
*   **Target Definition:** The choice of the target return is important. A zero target focuses on absolute losses. Other targets like mean return or risk-free rate can also be used.
*   **Difference from Total Standard Deviation:** If the return distribution is symmetric, downside deviation (with mean as target) will be approximately half of the total standard deviation. This relationship doesn't hold for skewed distributions.`
    },
    'variance_tooltip': {
        'fa': `**واریانس بازده (Variance of Returns):**
واریانس، میانگین مجذور انحرافات بازده‌ها از میانگین حسابی‌شان است. این شاخص، مانند انحراف معیار، میزان پراکندگی یا نوسان بازده‌ها را اندازه‌گیری می‌کند.

**کاربرد و ملاحظات برای تحلیلگر مالی (CFA):**
*   **پایه محاسبه انحراف معیار:** انحراف معیار، جذر واریانس است. واریانس به خودی خود به دلیل واحد مربع آن (مثلاً درصد مربع) کمتر به طور مستقیم تفسیر می‌شود، اما از نظر ریاضی اهمیت دارد.
*   **خواص ریاضی در نظریه پورتفولیو:** واریانس دارای خواص ریاضی مفیدی است که استفاده از آن را در مدل‌های آماری و مالی، به ویژه در نظریه پورتفولیو مارکویتز، تسهیل می‌کند. برای مثال، محاسبه واریانس یک پورتفولیو متشکل از چندین دارایی، با استفاده از واریانس تک تک دارایی‌ها و کوواریانس بین آن‌ها انجام می‌شود.
*   **عدم شهود مستقیم:** از آنجا که واحد آن مجذور واحد بازده است، تفسیر مستقیم و شهودی آن برای ریسک، دشوارتر از انحراف معیار است.
*   **حساسیت به داده‌های پرت:** همانند میانگین حسابی و انحراف معیار، واریانس نیز به شدت تحت تأثیر داده‌های پرت قرار می‌گیرد. یک داده پرت با فاصله زیاد از میانگین، به دلیل به توان دو رسیدن، تأثیر بسیار زیادی بر واریانس خواهد داشت.
*   **استفاده در آزمون‌های آماری:** واریانس در بسیاری از آزمون‌های فرض آماری و مدل‌های رگرسیونی کاربرد دارد.`,
        'en': `**Variance of Returns:**
The average of the squared deviations of returns from their arithmetic mean. Like standard deviation, it measures return dispersion or volatility.

**Use & Considerations for CFA Charterholders:**
*   **Basis for Standard Deviation:** Standard deviation is the square root of variance. Variance itself is less directly interpreted due to its squared unit (e.g., percent-squared) but is mathematically significant.
*   **Mathematical Properties in Portfolio Theory:** Variance has useful mathematical properties that facilitate its use in statistical and financial models, particularly in Markowitz portfolio theory. For example, calculating the variance of a portfolio of multiple assets involves the variances of individual assets and the covariances between them.
*   **Less Intuitive:** Being in squared units (e.g., if returns are in percent, variance is in percent-squared), its direct interpretation for risk is harder than standard deviation.
*   **Outlier Sensitivity:** Highly affected by outliers, similar to arithmetic mean and standard deviation. An outlier with a large deviation from the mean will have a very large impact on variance due to the squaring effect.
*   **Use in Statistical Tests:** Variance is used in many statistical hypothesis tests and regression models.`
    },
    'cv_tooltip': {
        'fa': `**ضریب تغییرات (Coefficient of Variation - CV):**
ضریب تغییرات یک معیار ریسک نسبی است که از تقسیم انحراف معیار بر قدر مطلق میانگین بازده به دست می‌آید. این شاخص نشان می‌دهد که به ازای هر واحد بازده مورد انتظار، چه میزان ریسک (نوسان) وجود دارد.

**کاربرد و ملاحظات برای تحلیلگر مالی (CFA):**
*   **مقایسه ریسک دارایی‌های با بازده متفاوت:** CV برای مقایسه ریسک سرمایه‌گذاری‌هایی که میانگین بازده آن‌ها به طور قابل توجهی متفاوت است، بسیار مفید است. انحراف معیار به تنهایی ممکن است در این موارد گمراه‌کننده باشد. برای مثال، یک دارایی با بازده میانگین ۲۰٪ و انحراف معیار ۱۰٪، CV برابر ۰.۵ دارد. دارایی دیگر با بازده میانگین ۱۰٪ و انحراف معیار ۷٪، CV برابر ۰.۷ دارد. با وجود انحراف معیار کمتر، دارایی دوم به ازای هر واحد بازده، ریسک بیشتری دارد.
*   **بدون واحد:** CV یک عدد بدون واحد است که تفسیر و مقایسه آن را آسان می‌کند.
*   **هرچه کمتر، بهتر:** مقدار CV پایین‌تر نشان‌دهنده ریسک کمتر به ازای هر واحد بازده است و معمولاً مطلوب‌تر تلقی می‌شود.
*   **محدودیت برای میانگین‌های نزدیک به صفر:** اگر میانگین بازده بسیار کوچک یا نزدیک به صفر باشد، CV می‌تواند مقادیر بسیار بزرگی به خود بگیرد و تفسیر آن دشوار شود یا حتی بی‌معنا باشد. همچنین برای میانگین‌های منفی، معمولاً از قدر مطلق میانگین در مخرج استفاده می‌شود تا از نتایج بی‌معنا جلوگیری شود.
*   **مکمل سایر معیارها:** CV نباید به تنهایی استفاده شود، بلکه به عنوان یک ابزار مکمل در کنار سایر معیارهای ریسک و بازده مانند نسبت شارپ و بررسی توزیع بازده‌ها قرار می‌گیرد.`,
        'en': `**Coefficient of Variation (CV):**
The CV is a relative measure of risk, calculated by dividing the standard deviation by the absolute value of the mean return. It indicates how much risk (volatility) exists per unit of expected return.

**Use & Considerations for CFA Charterholders:**
*   **Comparing Risk of Assets with Different Returns:** CV is very useful for comparing the risk of investments that have significantly different mean returns. Standard deviation alone might be misleading in such cases. For example, an asset with a mean return of 20% and a standard deviation of 10% has a CV of 0.5. Another asset with a mean return of 10% and a standard deviation of 7% has a CV of 0.7. Despite the lower standard deviation, the second asset is riskier per unit of return.
*   **Unitless:** CV is a unitless number, making it easy to interpret and compare.
*   **Lower is Better:** A lower CV indicates less risk per unit of return and is generally considered more desirable.
*   **Limitation for Means Near Zero:** If the mean return is very small or close to zero, the CV can become very large and difficult to interpret or even meaningless. For negative means, the absolute value of the mean is typically used in the denominator to avoid nonsensical results.
*   **Complements Other Metrics:** CV should not be used in isolation but as a complementary tool alongside other risk and return measures like the Sharpe ratio and an examination of the return distribution.`
    },
    'mdd_tooltip': {
        'fa': `**حداکثر افت سرمایه (Maximum Drawdown - MDD):**
MDD بزرگترین درصد کاهش از یک سقف (Peak) قبلی به یک حضیض (Trough) بعدی در طول یک دوره زمانی مشخص است. این شاخص نشان‌دهنده بدترین زیان تجربه شده توسط سرمایه‌گذاری است که در بالاترین نقطه وارد شده و در پایین‌ترین نقطه خارج شده باشد (قبل از اینکه یک سقف جدید شکل بگیرد).

**کاربرد و ملاحظات برای تحلیلگر مالی (CFA):**
*   **اندازه‌گیری ریسک زیان شدید:** MDD یک معیار مهم برای ارزیابی ریسک نزولی و به خصوص ریسک تجربه زیان‌های بزرگ و طولانی مدت است. این شاخص به سرمایه‌گذار کمک می‌کند تا بدترین سناریوی تاریخی را درک کند.
*   **تأثیر روانی:** زیان‌های بزرگ می‌توانند تأثیر روانی قابل توجهی بر سرمایه‌گذاران داشته باشند و منجر به تصمیمات احساسی شوند. MDD به ارزیابی تحمل ریسک سرمایه‌گذار کمک می‌کند.
*   **مقایسه استراتژی‌ها و مدیران:** برای مقایسه عملکرد استراتژی‌های سرمایه‌گذاری مختلف یا مدیران صندوق‌ها، به خصوص از منظر مدیریت ریسک، استفاده می‌شود.
*   **وابستگی به دوره زمانی:** مقدار MDD به دوره زمانی تحلیل شده بستگی دارد. دوره‌های طولانی‌تر احتمال مشاهده MDD بزرگتر را افزایش می‌دهند.
*   **عدم نمایش فراوانی:** MDD فقط بزرگترین افت را نشان می‌دهد و اطلاعاتی در مورد فراوانی یا شدت سایر افت‌های کوچکتر ارائه نمی‌دهد.
*   **اهمیت در مدیریت ثروت:** برای مشتریانی که به حفظ سرمایه اهمیت زیادی می‌دهند، MDD یک پارامتر کلیدی در انتخاب سرمایه‌گذاری‌ها است.`,
        'en': `**Maximum Drawdown (MDD):**
The MDD is the largest percentage decline from a previous peak to a subsequent trough during a specific period. It represents the worst loss an investment would have experienced if an investor bought at the highest point and sold at the lowest point before a new peak was formed.

**Use & Considerations for CFA Charterholders:**
*   **Measuring Extreme Loss Risk:** MDD is a critical measure for assessing downside risk, especially the risk of experiencing large and prolonged losses. It helps investors understand the worst-case historical scenario.
*   **Psychological Impact:** Large losses can have a significant psychological impact on investors, potentially leading to emotional decisions. MDD helps in assessing an investor's risk tolerance.
*   **Comparing Strategies and Managers:** Used to compare the performance of different investment strategies or fund managers, particularly from a risk management perspective.
*   **Time Period Dependency:** The MDD value depends on the analyzed time period. Longer periods increase the likelihood of observing a larger MDD.
*   **No Frequency Information:** MDD only shows the largest drawdown and provides no information about the frequency or severity of other smaller drawdowns.
*   **Importance in Wealth Management:** For clients who prioritize capital preservation, MDD is a key parameter in investment selection.`
    },
    'mdd_period_tooltip': {
        'fa': `**دوره حداکثر افت سرمایه (MDD Period):**
این شاخص، تعداد دوره‌ها (مثلاً روزها، هفته‌ها، یا ماه‌ها، بسته به فرکانس داده‌ها) را نشان می‌دهد که حداکثر افت سرمایه (MDD) در طول آن رخ داده است؛ یعنی از زمانی که ارزش سرمایه‌گذاری در سقف (Peak) بوده تا زمانی که به حضیض (Trough) رسیده است.

**کاربرد و ملاحظات برای تحلیلگر مالی (CFA):**
*   **ارائه زمینه به MDD:** صرفاً دانستن مقدار MDD کافی نیست. دانستن اینکه این افت چقدر طول کشیده تا به کف خود برسد، به درک بهتر شدت و پایداری آن کمک می‌کند. یک MDD بزرگ که در مدت کوتاهی رخ داده، ممکن است از یک MDD مشابه که در مدت زمان بسیار طولانی‌تری اتفاق افتاده، تأثیر متفاوتی داشته باشد.
*   **زمان بازیابی (Recovery Time):** اگرچه این شاخص مستقیماً زمان بازیابی (مدت زمان لازم برای بازگشت به سقف قبلی) را نشان نمی‌دهد، اما پیش‌زمینه‌ای برای آن فراهم می‌کند. دوره‌های افت طولانی‌تر معمولاً به زمان بازیابی طولانی‌تری نیز نیاز دارند.
*   **ارزیابی پایداری استراتژی:** استراتژی‌هایی که دوره‌های افت کوتاهتری دارند، حتی اگر مقدار MDD آن‌ها مشابه سایرین باشد، ممکن است برای سرمایه‌گذاران با تحمل ریسک کمتر، جذاب‌تر باشند.
*   **تکمیل کننده MDD:** این معیار باید همیشه در کنار مقدار MDD تفسیر شود تا تصویر کامل‌تری از ریسک تجربه شده ارائه دهد.`,
        'en': `**MDD Period:**
This indicates the number of periods (e.g., days, weeks, or months, depending on data frequency) over which the maximum drawdown (MDD) occurred; i.e., from the time the investment value was at its peak until it reached its trough.

**Use & Considerations for CFA Charterholders:**
*   **Provides Context to MDD:** Knowing just the MDD magnitude isn't enough. Understanding how long it took for this drawdown to reach its bottom helps in better grasping its severity and persistence. A large MDD that occurred over a short period might have a different impact than a similar MDD that unfolded over a much longer timeframe.
*   **Recovery Time:** While this metric doesn't directly show recovery time (time to get back to the previous peak), it provides a precursor. Longer drawdown periods often imply longer recovery times.
*   **Assessing Strategy Resilience:** Strategies with shorter drawdown periods, even if their MDD magnitude is similar to others, might be more palatable for investors with lower risk tolerance.
*   **Complements MDD:** This metric should always be interpreted alongside the MDD value to provide a more complete picture of the experienced risk.`
    },
    'skewness_tooltip': {
        'fa': `**چولگی (Skewness):**
چولگی معیاری برای عدم تقارن توزیع احتمالی بازده‌های یک سرمایه‌گذاری حول میانگین آن است.
*   **چولگی مثبت (Positive Skewness):** نشان می‌دهد که دم سمت راست توزیع بلندتر یا "چاق‌تر" از دم سمت چپ است. این یعنی تعداد بیشتری بازده کوچک منفی یا نزدیک به صفر وجود دارد، اما احتمال وقوع بازده‌های بسیار بزرگ مثبت (داده‌های پرت مثبت) نیز بیشتر است. میانگین در این حالت معمولاً بزرگتر از میانه است.
*   **چولگی منفی (Negative Skewness):** نشان می‌دهد که دم سمت چپ توزیع بلندتر یا "چاق‌تر" از دم سمت راست است. این یعنی تعداد بیشتری بازده کوچک مثبت یا نزدیک به صفر وجود دارد، اما احتمال وقوع بازده‌های بسیار بزرگ منفی (زیان‌های شدید یا داده‌های پرت منفی) نیز بیشتر است. میانگین در این حالت معمولاً کوچکتر از میانه است.
*   **چولگی صفر:** توزیع کاملاً متقارن است (مانند توزیع نرمال).

**کاربرد و ملاحظات برای تحلیلگر مالی (CFA):**
*   **درک ریسک و پتانسیل بازده نامتقارن:** چولگی به درک بهتر ماهیت ریسک و بازده کمک می‌کند. سرمایه‌گذاران معمولاً چولگی مثبت را ترجیح می‌دهند (پتانسیل سودهای بزرگ و نامحدود، در حالی که زیان‌ها محدود به ۱۰۰-٪ است)، هرچند این ممکن است با فراوانی بیشتر زیان‌های کوچک همراه باشد. چولگی منفی نشان‌دهنده ریسک "سقوط ناگهانی" یا زیان‌های فاجعه‌بار است.
*   **ارزیابی استراتژی‌ها:** برخی استراتژی‌ها ذاتاً چولگی خاصی دارند. مثلاً فروش اختیار معامله (option writing) معمولاً چولگی منفی دارد (سودهای کوچک و مکرر، با ریسک زیان بزرگ و نادر).
*   **کفایت معیارهای مبتنی بر میانگین-واریانس:** اگر چولگی قابل توجه باشد (مثلاً بیشتر از |0.5| یا |1|)، معیارهایی مانند نسبت شارپ که بر فرض نرمال بودن (و در نتیجه چولگی صفر) استوارند، ممکن است به تنهایی کافی نباشند.
*   **تأثیر بر مدیریت ریسک:** چولگی منفی نیازمند توجه ویژه در مدیریت ریسک است، زیرا انحراف معیار به تنهایی ممکن است ریسک دنباله را کمتر از حد برآورد کند.`,
        'en': `**Skewness:**
Measures the asymmetry of the probability distribution of investment returns around its mean.
*   **Positive Skewness:** Indicates the right tail of the distribution is longer or "fatter" than the left. This means more frequent small negative or near-zero returns, but a higher chance of very large positive returns (positive outliers). The mean is typically greater than the median.
*   **Negative Skewness:** Indicates the left tail is longer or "fatter." This means more frequent small positive or near-zero returns, but a higher chance of very large negative returns (severe losses or negative outliers). The mean is typically less than the median.
*   **Zero Skewness:** The distribution is perfectly symmetrical (like a normal distribution).

**Use & Considerations for CFA Charterholders:**
*   **Understanding Asymmetric Risk/Return Profiles:** Skewness helps in better understanding the nature of risk and return. Investors often prefer positive skewness (potential for large, unbounded gains while losses are limited to -100%), though this might come with more frequent small losses. Negative skewness indicates "crash risk" or catastrophic losses.
*   **Evaluating Strategies:** Some strategies inherently have specific skewness. For example, option writing typically exhibits negative skewness (small, frequent gains with a risk of rare, large losses).
*   **Adequacy of Mean-Variance Metrics:** If skewness is significant (e.g., beyond |0.5| or |1|), metrics like the Sharpe ratio, which assume normality (and thus zero skewness), may not be sufficient alone.
*   **Impact on Risk Management:** Negative skewness requires special attention in risk management, as standard deviation alone might underestimate tail risk.`
    },
    'kurtosis_tooltip': {
        'fa': `**کشیدگی اضافی (Excess Kurtosis):**
کشیدگی معیاری برای سنجش "دنباله‌دار بودن" (tailedness) یا "قله‌دار بودن" (peakedness) توزیع بازده‌ها در مقایسه با توزیع نرمال است. کشیدگی اضافی، کشیدگی توزیع را نسبت به کشیدگی توزیع نرمال (که برابر با ۳ است) می‌سنجد. بنابراین، کشیدگی اضافی برای توزیع نرمال صفر است.
*   **مثبت (Leptokurtic / لپتوکورتیک):** کشیدگی اضافی > ۰. توزیع دارای قله تیزتر و دنباله‌های "چاق‌تر" (fatter tails) نسبت به توزیع نرمال است. این یعنی احتمال وقوع داده‌های پرت (بازده‌های بسیار بزرگ مثبت یا منفی) بیشتر از آن چیزی است که توزیع نرمال پیش‌بینی می‌کند. داده‌ها بیشتر در اطراف میانگین و در دنباله‌ها متمرکز شده‌اند و کمتر در "شانه‌ها"ی توزیع قرار دارند.
*   **منفی (Platykurtic / پلاتیکورتیک):** کشیدگی اضافی < ۰. توزیع دارای قله پهن‌تر و دنباله‌های "لاغرتر" (thinner tails) نسبت به توزیع نرمال است. این یعنی احتمال وقوع داده‌های پرت کمتر از توزیع نرمال است. داده‌ها بیشتر در شانه‌های توزیع پراکنده‌اند.
*   **صفر (Mesokurtic / مزوکورتیک):** کشیدگی اضافی = ۰. توزیع دارای کشیدگی مشابه توزیع نرمال است.

**کاربرد و ملاحظات برای تحلیلگر مالی (CFA):**
*   **ارزیابی ریسک دنباله (Tail Risk):** کشیدگی بالا (لپتوکورتیک) نشان‌دهنده ریسک بیشتر وقوع رویدادهای شدید و نادر (هم سودهای بسیار بزرگ و هم زیان‌های بسیار بزرگ) است. در این حالت، انحراف معیار به تنهایی ممکن است ریسک واقعی را کمتر از حد برآورد کند.
*   **تأثیر بر مدل‌سازی ریسک:** مدل‌های مدیریت ریسک (مانند VaR) که بر فرض توزیع نرمال بنا شده‌اند، در حضور کشیدگی بالا ممکن است ریسک را دست کم بگیرند.
*   **تشخیص حباب‌ها یا سقوط‌ها:** بازارهای مالی اغلب کشیدگی اضافی مثبت از خود نشان می‌دهند، که منعکس‌کننده این واقعیت است که حرکات شدید قیمت (چه مثبت و چه منفی) بیشتر از آنچه تحت توزیع نرمال انتظار می‌رود، رخ می‌دهند.
*   **تفسیر مقادیر:** کشیدگی اضافی بیشتر از ۱ معمولاً قابل توجه تلقی می‌شود.`,
        'en': `**Excess Kurtosis:**
Kurtosis measures the "tailedness" or "peakedness" of the return distribution compared to a normal distribution. Excess kurtosis measures the kurtosis of a distribution relative to that of a normal distribution (which is 3). Thus, excess kurtosis for a normal distribution is 0.
*   **Positive (Leptokurtic):** Excess Kurtosis > 0. The distribution has a sharper peak and "fatter tails" than a normal distribution. This means extreme outliers (very large positive or negative returns) are more likely than predicted by a normal distribution. Data are more concentrated around the mean and in the tails, and less in the "shoulders" of the distribution.
*   **Negative (Platykurtic):** Excess Kurtosis < 0. The distribution has a flatter peak and "thinner tails" than a normal distribution. This means extreme outliers are less likely than in a normal distribution. Data are more spread out in the shoulders.
*   **Zero (Mesokurtic):** Excess Kurtosis = 0. The distribution has kurtosis similar to a normal distribution.

**Use & Considerations for CFA Charterholders:**
*   **Assessing Tail Risk:** High kurtosis (leptokurtic) indicates a greater risk of extreme, rare events (both very large gains and very large losses). In this case, standard deviation alone may underestimate true risk.
*   **Impact on Risk Modeling:** Risk management models (like VaR) based on the assumption of normality may underestimate risk in the presence of high kurtosis.
*   **Identifying Bubbles or Crashes:** Financial markets often exhibit positive excess kurtosis, reflecting the fact that extreme price movements (both positive and negative) occur more frequently than would be expected under a normal distribution.
*   **Interpreting Values:** Excess kurtosis greater than 1 is often considered significant.`
    },
    'normality_tooltip': {
        'fa': `**مفهوم آزمون نرمال بودن داده‌ها:**
بسیاری از مدل‌ها و معیارهای مالی (مانند نسبت شارپ، انحراف معیار به عنوان ریسک کل، و مدل CAPM) بر این فرض بنا شده‌اند که بازده سرمایه‌گذاری از یک توزیع نرمال (زنگوله‌ای شکل) پیروی می‌کند. توزیع نرمال دارای ویژگی‌های خاصی است: متقارن است (چولگی صفر) و دارای کشیدگی خاصی است (کشیدگی اضافی صفر).

**اهمیت بررسی نرمال بودن (حتی اگر در این برنامه محاسبه نشود):**
*   **اعتبار مدل‌ها:** اگر داده‌های بازده واقعی نرمال نباشند، نتایج و تفاسیر حاصل از مدل‌هایی که بر فرض نرمال بودن استوارند، ممکن است گمراه‌کننده یا نادرست باشند.
*   **درک ریسک واقعی:** انحراف معیار در توزیع‌های غیرنرمال (به خصوص با چولگی و کشیدگی بالا) ممکن است ریسک واقعی، به ویژه ریسک رویدادهای شدید (tail risk)، را کمتر از حد برآورد کند.
*   **انتخاب معیارهای مناسب:** در صورت غیرنرمال بودن داده‌ها، استفاده از معیارهای جایگزین یا مکمل (مانند CVaR، نسبت سورتینو، نسبت امگا، یا بررسی مستقیم چولگی و کشیدگی) برای تحلیل ریسک و بازده ضروری می‌شود.
*   **آزمون‌های رایج:** آزمون‌های آماری مختلفی مانند شاپیرو-ویلک (Shapiro-Wilk)، جارک-برا (Jarque-Bera)، یا کلموگروف-اسمیرنوف (Kolmogorov-Smirnov) برای بررسی نرمال بودن داده‌ها استفاده می‌شوند.

**توجه:** این برنامه در حال حاضر آزمون آماری نرمال بودن را انجام نمی‌دهد. مقادیر چولگی و کشیدگی می‌توانند سرنخ‌هایی در مورد میزان انحراف از نرمال بودن ارائه دهند.`,
        'en': `**Concept of Normality Testing:**
Many financial models and metrics (like the Sharpe ratio, standard deviation as total risk, and CAPM) are based on the assumption that investment returns follow a normal (bell-shaped) distribution. A normal distribution has specific characteristics: it is symmetrical (zero skewness) and has a specific kurtosis (zero excess kurtosis).

**Importance of Checking for Normality (even if not calculated in this app):**
*   **Model Validity:** If actual return data are not normal, the results and interpretations from models assuming normality can be misleading or incorrect.
*   **Understanding True Risk:** In non-normal distributions (especially with high skewness and kurtosis), standard deviation might underestimate true risk, particularly tail risk.
*   **Choosing Appropriate Metrics:** If data are non-normal, using alternative or complementary metrics (like CVaR, Sortino ratio, Omega ratio, or directly examining skewness and kurtosis) becomes essential for risk and return analysis.
*   **Common Tests:** Various statistical tests like Shapiro-Wilk, Jarque-Bera, or Kolmogorov-Smirnov are used to check for normality.

**Note:** This application does not currently perform a statistical normality test. The skewness and kurtosis values can provide clues about deviations from normality.`
    },
    'var_tooltip': {
        'fa': `**ارزش در معرض خطر (VaR) ۵٪ تاریخی:**
VaR یک معیار ریسک است که حداکثر زیان مورد انتظار برای یک سرمایه‌گذاری را در یک دوره زمانی مشخص و با یک سطح اطمینان معین، بر اساس داده‌های تاریخی، تخمین می‌زند. VaR ۵٪ به این معناست که با اطمینان ۹۵٪، انتظار می‌رود زیان روزانه/دوره‌ای از این مقدار بیشتر نشود؛ یا به عبارت دیگر، ۵٪ احتمال دارد که زیان واقعی از این مقدار فراتر رود (بدتر شود).

**کاربرد و ملاحظات برای تحلیلگر مالی (CFA):**
*   **اندازه‌گیری ریسک نزولی:** VaR یک عدد واحد برای بیان ریسک نزولی ارائه می‌دهد که فهم آن نسبتاً آسان است.
*   **گزارش‌دهی ریسک و تخصیص سرمایه:** به طور گسترده در مدیریت ریسک، گزارش‌دهی به نهادهای نظارتی، و تعیین حدود ریسک و تخصیص سرمایه استفاده می‌شود.
*   **مفروضات:** VaR تاریخی فرض می‌کند که الگوهای بازده گذشته در آینده نیز تکرار خواهند شد. روش‌های دیگری برای محاسبه VaR وجود دارد (پارامتریک، مونت کارلو) که مفروضات متفاوتی دارند.
*   **محدودیت‌ها:**
    *   **عدم نمایش شدت زیان در دنباله:** VaR نمی‌گوید اگر زیان از آستانه آن فراتر رفت، *چقدر* می‌تواند باشد. فقط نقطه برش را نشان می‌دهد. برای این منظور، معیارهایی مانند CVaR (کسری مورد انتظار) مناسب‌ترند.
    *   **عدم جامعیت (Subadditivity):** VaR همیشه یک معیار ریسک جامع نیست، به این معنی که VaR یک پورتفولیو ممکن است از مجموع VaR اجزای آن بیشتر باشد (اثر تنوع‌بخشی را به درستی نشان نمی‌دهد). CVaR این خاصیت را دارد.
    *   **حساسیت به پارامترها:** مقدار VaR به دوره زمانی، سطح اطمینان و روش محاسبه انتخاب شده حساس است.
*   **تفسیر:** مقدار منفی نشان‌دهنده زیان است. مثلاً VaR ۵٪ برابر با ۲-% یعنی ۵٪ احتمال دارد در دوره بعدی حداقل ۲٪ زیان کنید.`,
        'en': `**Historical Value at Risk (VaR) 5%:**
VaR is a risk measure that estimates the maximum expected loss for an investment over a specific time horizon and at a given confidence level, based on historical data. A VaR 5% means that with 95% confidence, the daily/periodical loss is not expected to exceed this amount; or, in other words, there is a 5% chance that the actual loss will be worse than this amount.

**Use & Considerations for CFA Charterholders:**
*   **Measuring Downside Risk:** VaR provides a single number for downside risk that is relatively easy to understand.
*   **Risk Reporting and Capital Allocation:** Widely used in risk management, regulatory reporting, and setting risk limits and capital allocation.
*   **Assumptions:** Historical VaR assumes that past return patterns will repeat in the future. Other methods exist for calculating VaR (parametric, Monte Carlo) with different assumptions.
*   **Limitations:**
    *   **Doesn't Show Severity of Tail Losses:** VaR doesn't tell you *how much* you could lose if the loss exceeds its threshold. It only shows the cutoff point. For this, metrics like CVaR (Expected Shortfall) are more suitable.
    *   **Not Always Subadditive:** VaR is not always a coherent risk measure, meaning the VaR of a portfolio can be greater than the sum of the VaRs of its components (doesn't always properly reflect diversification). CVaR is subadditive.
    *   **Parameter Sensitivity:** The VaR value is sensitive to the chosen time horizon, confidence level, and calculation method.
*   **Interpretation:** A negative value indicates a loss. E.g., a VaR 5% of -2% means there is a 5% chance of losing at least 2% in the next period.`
    },
    'var_95_tooltip': {
        'fa': `**سود تاریخی ۹۵٪ (صدک ۹۵ام بازده‌ها):**
این معیار نشان‌دهنده سطحی از بازده است که در ۹۵٪ مواقع در دوره تاریخی مورد بررسی، بازده واقعی *کمتر یا مساوی* آن بوده است. به عبارت دیگر، تنها در ۵٪ مواقع، بازده واقعی از این سطح فراتر رفته (بهتر شده) است.

**کاربرد و ملاحظات برای تحلیلگر مالی (CFA):**
*   **بررسی پتانسیل سود بالا (دنباله راست):** این معیار به ما کمک می‌کند تا یک نقطه مرجع برای بازده‌های بسیار خوب در توزیع تاریخی داشته باشیم. نشان می‌دهد که برای قرار گرفتن در ۵٪ بهترین بازده‌های تاریخی، چه عملکردی لازم بوده است.
*   **مکمل VaR:** در حالی که VaR ۵٪ به بدترین ۵٪ زیان‌ها نگاه می‌کند، این معیار به بهترین ۵٪ سودها (یا به طور دقیق‌تر، نقطه‌ای که ۹۵٪ بازده‌ها از آن کمتر هستند) توجه دارد.
*   **درک پراکندگی در سمت مثبت:** به درک بهتر گستره بازده‌های مثبت و احتمال وقوع سودهای بسیار بالا کمک می‌کند.
*   **محدودیت:** مانند سایر معیارهای تاریخی، تضمینی برای تکرار آن در آینده نیست. همچنین، این معیار به تنهایی ریسک‌های مرتبط با کسب این سودها را نشان نمی‌دهد.
*   **تفسیر:** اگر سود تاریخی ۹۵٪ برابر با ۱۰٪ باشد، یعنی در ۹۵ درصد از دوره‌های گذشته، بازده کمتر یا مساوی ۱۰٪ بوده و فقط در ۵ درصد از دوره‌ها، بازدهی بیشتر از ۱۰٪ کسب شده است.`,
        'en': `**Historical Gain 95% (95th Percentile of Returns):**
This metric indicates a level of return such that 95% of the time in the historical period under review, the actual return was *less than or equal to* it. In other words, only 5% of the time did the actual return exceed (was better than) this level.

**Use & Considerations for CFA Charterholders:**
*   **Examining High Profit Potential (Right Tail):** This helps establish a reference point for very good returns in the historical distribution. It shows what performance was needed to be in the top 5% of historical returns.
*   **Complements VaR:** While VaR 5% looks at the worst 5% of losses, this metric focuses on the best 5% of gains (or more accurately, the point below which 95% of returns lie).
*   **Understanding Upside Dispersion:** Helps in better understanding the range of positive returns and the likelihood of very high profits.
*   **Limitation:** Like other historical metrics, it's not a guarantee of future performance. Also, this metric alone doesn't show the risks associated with achieving these gains.
*   **Interpretation:** If the Historical Gain 95% is 10%, it means that in 95% of past periods, the return was less than or equal to 10%, and only in 5% of periods was a return greater than 10% achieved.`
    },
    'max_gain_tooltip': {
        'fa': `**حداکثر سود (Maximum Gain):**
این معیار، بالاترین بازده مشاهده شده در یک تک دوره (مثلاً روزانه، هفتگی) در کل سری زمانی داده‌های ورودی است.

**کاربرد و ملاحظات برای تحلیلگر مالی (CFA):**
*   **نشان‌دهنده پتانسیل رشد حداکثری در گذشته:** حداکثر سود به ما نشان می‌دهد که در بهترین حالت، سرمایه‌گذاری مورد نظر در یک دوره چقدر بازدهی داشته است. این می‌تواند جذاب باشد، اما باید با احتیاط تفسیر شود.
*   **احتمال رویداد نادر:** حداکثر سود معمولاً یک رویداد نادر است و نباید انتظار داشت که به طور مکرر تکرار شود.
*   **نیاز به بررسی زمینه:** مهم است که دلیل وقوع چنین سود بزرگی بررسی شود. آیا ناشی از یک رویداد خاص و غیرقابل تکرار بوده (مانند اعلام یک خبر بسیار مثبت) یا بخشی از رفتار معمول دارایی در شرایط خاص بازار است؟
*   **عدم نمایش ریسک:** این معیار هیچ اطلاعاتی در مورد ریسک یا نوسانات کلی سرمایه‌گذاری ارائه نمی‌دهد. یک سرمایه‌گذاری می‌تواند حداکثر سود بالایی داشته باشد اما همزمان بسیار پرریسک و با زیان‌های بزرگ نیز همراه باشد.
*   **مقایسه با حداکثر زیان (MDD):** مقایسه حداکثر سود با حداکثر افت سرمایه (MDD) و سایر معیارهای توزیع بازده می‌تواند دید بهتری نسبت به دامنه نوسانات و عدم تقارن احتمالی آن ارائه دهد.`,
        'en': `**Maximum Gain:**
This metric is the single highest observed return in a single period (e.g., daily, weekly) within the entire input data series.

**Use & Considerations for CFA Charterholders:**
*   **Indicates Maximum Past Upside Potential:** The maximum gain shows how much the investment returned in its best single period. This can be attractive but must be interpreted with caution.
*   **Likely a Rare Event:** The maximum gain is usually a rare event and should not be expected to repeat frequently.
*   **Need for Contextual Review:** It's important to investigate why such a large gain occurred. Was it due to a specific, unrepeatable event (like a very positive news announcement) or part of the asset's typical behavior under certain market conditions?
*   **No Risk Indication:** This metric provides no information about the overall risk or volatility of the investment. An investment can have a high maximum gain but also be very risky and prone to large losses.
*   **Comparison with Maximum Drawdown (MDD):** Comparing the maximum gain with the MDD and other return distribution metrics can provide a better perspective on the range of fluctuations and potential asymmetry.`
    },
    'sharpe_tooltip': {
        'fa': `**نسبت شارپ (Sharpe Ratio):**
نسبت شارپ یک معیار شناخته شده برای اندازه‌گیری بازده تعدیل شده بر اساس ریسک است. این نسبت از تقسیم بازده مازاد یک سرمایه‌گذاری نسبت به نرخ بازده بدون ریسک (Excess Return) بر انحراف معیار آن (که به عنوان نماینده ریسک کل در نظر گرفته می‌شود) به دست می‌آید.
فرمول: (میانگین بازده دارایی - نرخ بازده بدون ریسک) / انحراف معیار بازده دارایی.

**کاربرد و ملاحظات برای تحلیلگر مالی (CFA):**
*   **مقایسه سرمایه‌گذاری‌ها:** نسبت شارپ امکان مقایسه جذابیت سرمایه‌گذاری‌های مختلف را بر اساس بازدهی که به ازای هر واحد ریسک ارائه می‌دهند، فراهم می‌کند. مقدار بالاتر نشان‌دهنده عملکرد بهتر به ازای ریسک پذیرفته شده است.
*   **رتبه‌بندی پورتفولیوها و استراتژی‌ها:** به طور گسترده برای رتبه‌بندی مدیران سرمایه‌گذاری، صندوق‌ها و استراتژی‌های معاملاتی استفاده می‌شود.
*   **مفروضات:** به طور ضمنی فرض می‌کند که بازده‌ها دارای توزیع نرمال هستند (یا حداقل توزیع متقارن با چولگی و کشیدگی کم). همچنین فرض می‌کند که انحراف معیار، نماینده مناسبی برای ریسک کل است.
*   **محدودیت‌ها در توزیع‌های غیرنرمال:** اگر توزیع بازده‌ها به طور قابل توجهی غیرنرمال باشد (مثلاً چولگی یا کشیدگی زیادی داشته باشد)، نسبت شارپ ممکن است تصویر کاملی از عملکرد تعدیل شده بر اساس ریسک ارائه ندهد. در این موارد، معیارهایی مانند نسبت سورتینو یا نسبت امگا ممکن است مناسب‌تر باشند.
*   **حساسیت به نرخ بدون ریسک:** انتخاب نرخ بدون ریسک مناسب اهمیت دارد و می‌تواند بر مقدار نسبت شارپ تأثیر بگذارد.
*   **تفسیر مقادیر:** نسبت شارپ بالاتر از ۱ معمولاً خوب تلقی می‌شود، بالاتر از ۲ بسیار خوب و بالاتر از ۳ عالی است. با این حال، این مقادیر باید در زمینه بازار و نوع دارایی تفسیر شوند. نسبت شارپ منفی نشان می‌دهد که بازده دارایی حتی از نرخ بدون ریسک نیز کمتر بوده است.`,
        'en': `**Sharpe Ratio:**
A well-known measure of risk-adjusted return. It's calculated by dividing the excess return of an investment (over the risk-free rate) by its standard deviation (which represents total risk).
Formula: (Mean Asset Return - Risk-Free Rate) / Standard Deviation of Asset Returns.

**Use & Considerations for CFA Charterholders:**
*   **Comparing Investments:** The Sharpe ratio allows comparison of the attractiveness of different investments based on the return they generate per unit of risk. A higher value indicates better performance for the risk taken.
*   **Ranking Portfolios and Strategies:** Widely used for ranking investment managers, funds, and trading strategies.
*   **Assumptions:** Implicitly assumes that returns are normally distributed (or at least symmetrically distributed with low skewness and kurtosis). It also assumes standard deviation is an adequate proxy for total risk.
*   **Limitations with Non-Normal Distributions:** If return distributions are significantly non-normal (e.g., high skewness or kurtosis), the Sharpe ratio may not provide a complete picture of risk-adjusted performance. In such cases, metrics like the Sortino ratio or Omega ratio might be more appropriate.
*   **Sensitivity to Risk-Free Rate:** The choice of an appropriate risk-free rate is important and can affect the Sharpe ratio value.
*   **Interpreting Values:** A Sharpe ratio above 1 is generally considered good, above 2 very good, and above 3 excellent. However, these values should be interpreted in the context of the market and asset type. A negative Sharpe ratio indicates the asset underperformed even the risk-free rate.`
    },
    'sortino_tooltip': {
        'fa': `**نسبت سورتینو (Sortino Ratio):**
نسبت سورتینو مشابه نسبت شارپ است، اما در مخرج کسر به جای انحراف معیار کل، از انحراف معیار نزولی (Downside Deviation) استفاده می‌کند. انحراف معیار نزولی فقط نوسانات بازده‌های کمتر از یک آستانه معین (معمولاً نرخ بدون ریسک یا صفر) را به عنوان ریسک در نظر می‌گیرد.
فرمول: (میانگین بازده دارایی - نرخ بازده بدون ریسک یا آستانه) / انحراف معیار نزولی بازده دارایی.

**کاربرد و ملاحظات برای تحلیلگر مالی (CFA):**
*   **تمرکز بر ریسک زیان:** این نسبت برای سرمایه‌گذارانی که بیشتر نگران ریسک زیان هستند و نوسانات مثبت را ریسک تلقی نمی‌کنند، معیار مناسب‌تری نسبت به شارپ است. این نسبت، بازده مازاد را فقط نسبت به ریسک "بد" یا نامطلوب می‌سنجد.
*   **مفید برای توزیع‌های نامتقارن:** اگر توزیع بازده‌ها چوله باشد (به خصوص چولگی منفی)، نسبت سورتینو می‌تواند تصویر دقیق‌تری از عملکرد تعدیل شده بر اساس ریسک واقعی (ریسک زیان) ارائه دهد، زیرا نسبت شارپ در این حالت ممکن است گمراه‌کننده باشد.
*   **جایگزین شارپ:** در تحلیل‌هایی که فرض نرمال بودن بازده‌ها معتبر نیست، سورتینو اغلب به شارپ ترجیح داده می‌شود.
*   **انتخاب آستانه:** انتخاب آستانه برای محاسبه انحراف معیار نزولی (که می‌تواند نرخ بدون ریسک، صفر، یا حداقل بازده قابل قبول MAR باشد) بر مقدار نسبت سورتینو تأثیرگذار است. در این تحلیل، آستانه صفر برای انحراف معیار نزولی و نرخ بدون ریسک برای بازده مازاد در صورت کسر استفاده شده است.
*   **مقدار بالاتر، بهتر:** همانند نسبت شارپ، مقدار بالاتر نسبت سورتینو نشان‌دهنده عملکرد بهتر به ازای هر واحد ریسک نزولی است.`,
        'en': `**Sortino Ratio:**
Similar to the Sharpe ratio, but it uses downside deviation instead of total standard deviation in the denominator. Downside deviation only considers the volatility of returns below a specified target (usually the risk-free rate or zero) as risk.
Formula: (Mean Asset Return - Risk-Free Rate or Target) / Downside Deviation of Asset Returns.

**Use & Considerations for CFA Charterholders:**
*   **Focus on Loss Risk:** This ratio is more suitable than Sharpe for investors who are primarily concerned with the risk of loss and do not consider positive volatility as risk. It measures excess return relative only to "bad" or undesirable risk.
*   **Useful for Asymmetric Distributions:** If return distributions are skewed (especially negatively skewed), the Sortino ratio can provide a more accurate picture of risk-adjusted performance against actual loss risk, as the Sharpe ratio might be misleading in such cases.
*   **Alternative to Sharpe:** Often preferred over Sharpe in analyses where the assumption of normality of returns is not valid.
*   **Target Selection:** The choice of the target for calculating downside deviation (which can be the risk-free rate, zero, or a Minimum Acceptable Return - MAR) affects the Sortino ratio value. In this analysis, a zero target is used for downside deviation, and the risk-free rate for excess return in the numerator.
*   **Higher is Better:** Like the Sharpe ratio, a higher Sortino ratio indicates better performance per unit of downside risk.`
    },
    'rf_tooltip': {
        'fa': `**نرخ بازده بدون ریسک (% سالانه):**
نرخ بازده بدون ریسک، نرخ بازده نظری یک سرمایه‌گذاری است که هیچ گونه ریسکی ندارد. در عمل، معمولاً بازده اوراق قرضه دولتی کوتاه‌مدت (مانند اسناد خزانه) به عنوان نماینده‌ای برای نرخ بدون ریسک در نظر گرفته می‌شود، زیرا فرض بر این است که دولت ناشر این اوراق، تعهدات خود را بازپرداخت خواهد کرد.

**کاربرد و ملاحظات برای تحلیلگر مالی (CFA):**
*   **مبنای ارزیابی بازده مازاد:** نرخ بدون ریسک به عنوان یک نرخ مبنا (Benchmark) برای ارزیابی عملکرد سایر سرمایه‌گذاری‌های پرریسک‌تر استفاده می‌شود. بازده مازاد یک سرمایه‌گذاری، تفاوت بین بازده آن سرمایه‌گذاری و نرخ بدون ریسک است.
*   **ورودی کلیدی در مدل‌های مالی:** در بسیاری از مدل‌های مالی و ارزش‌گذاری، از جمله مدل قیمت‌گذاری دارایی‌های سرمایه‌ای (CAPM) و در محاسبه نسبت‌های عملکرد تعدیل شده بر اساس ریسک مانند نسبت شارپ و سورتینو، نرخ بدون ریسک یک ورودی اساسی است.
*   **هزینه فرصت پذیرش ریسک:** نرخ بدون ریسک نشان‌دهنده حداقل بازدهی است که یک سرمایه‌گذار می‌تواند بدون پذیرش هیچ ریسکی به دست آورد. بنابراین، هرگونه بازده اضافی نسبت به این نرخ، پاداشی برای پذیرش ریسک تلقی می‌شود.
*   **انتخاب نرخ مناسب:** انتخاب نرخ بدون ریسک مناسب (مثلاً سررسید اوراق قرضه دولتی) باید با افق زمانی سرمایه‌گذاری و نوع تحلیل همخوانی داشته باشد. تغییر در نرخ بدون ریسک می‌تواند نتایج تحلیل‌ها را تحت تأثیر قرار دهد.`,
        'en': `**Risk-Free Rate (% Annually):**
The theoretical rate of return of an investment with zero risk. In practice, the return on short-term government bonds (like Treasury bills) is typically used as a proxy for the risk-free rate, as the issuing government is assumed to meet its obligations.

**Use & Considerations for CFA Charterholders:**
*   **Basis for Evaluating Excess Return:** The risk-free rate serves as a benchmark for evaluating the performance of other, riskier investments. The excess return of an investment is the difference between its return and the risk-free rate.
*   **Key Input in Financial Models:** A fundamental input in many financial and valuation models, including the Capital Asset Pricing Model (CAPM), and in calculating risk-adjusted performance ratios like Sharpe and Sortino.
*   **Opportunity Cost of Taking Risk:** The risk-free rate represents the minimum return an investor can achieve without taking on any risk. Therefore, any additional return above this rate is considered compensation for bearing risk.
*   **Choosing the Appropriate Rate:** The choice of the appropriate risk-free rate (e.g., maturity of the government bond) should align with the investment horizon and the type of analysis. Changes in the risk-free rate can impact analysis results.`
    },
    // CVaR and Omega tooltips were already expanded in a previous step, ensure they are consistent with this level of detail.
    'cvar_label': {
        'fa': "CVaR ۵٪ (کسری مورد انتظار)",
        'en': "CVaR 5% (Expected Shortfall)"
    },
    'cvar_tooltip': {
        'fa': `**ارزش در معرض خطر شرطی (CVaR) / کسری مورد انتظار (ES) ۵٪:**
این معیار میانگین زیان‌هایی است که در ۵٪ بدترین سناریوهای تاریخی بازده رخ می‌دهد (یعنی زمانی که زیان از نقطه VaR ۵٪ بیشتر یا مساوی آن می‌شود). CVaR به این سوال پاسخ می‌دهد: "اگر زیان از آستانه VaR فراتر رفت، به طور متوسط چقدر خواهد بود؟"

**کاربرد و ملاحظات برای تحلیلگر مالی (CFA):**
*   **درک بهتر ریسک دنباله (Tail Risk):** برخلاف VaR که فقط یک نقطه برش را نشان می‌دهد، CVaR شدت و میانگین زیان‌های واقعی در ناحیه دنباله توزیع بازده را اندازه‌گیری می‌کند. این امر به درک عمیق‌تری از زیان‌های شدید و نادر کمک می‌کند.
*   **مکمل VaR:** CVaR اطلاعات کامل‌تری نسبت به VaR در مورد توزیع زیان‌ها در ناحیه بحرانی فراهم می‌کند و تصویر واقعی‌تری از ریسک ارائه می‌دهد.
*   **مورد ترجیح در مدیریت ریسک پیشرفته:** بسیاری از نهادهای نظارتی و فعالان حرفه‌ای بازار، CVaR را به دلیل نمایش بهتر ریسک‌های فاجعه‌بار (catastrophic risks) و خاصیت جامعیت (subadditivity)، بر VaR ترجیح می‌دهند. (خاصیت جامعیت یعنی ریسک پورتفولیو از مجموع ریسک اجزای آن بیشتر نیست که VaR همیشه این ویژگی را ندارد).
*   **تصمیم‌گیری آگاهانه‌تر:** با ارائه تصویری از میانگین زیان‌های شدید، به سرمایه‌گذاران و مدیران ریسک کمک می‌کند تا تصمیمات آگاهانه‌تری در مورد تخصیص دارایی و مدیریت ریسک اتخاذ کنند.
*   **محاسبه:** ابتدا VaR ۵٪ محاسبه می‌شود، سپس تمام بازده‌هایی که کمتر یا مساوی این VaR هستند شناسایی شده و میانگین آن‌ها به عنوان CVaR ۵٪ در نظر گرفته می‌شود.`,
        'en': `**Conditional Value at Risk (CVaR) / Expected Shortfall (ES) 5%:**
This metric represents the average loss in the worst 5% of historical return scenarios (i.e., when losses are greater than or equal to the VaR 5% threshold). CVaR answers the question: "If the loss exceeds the VaR threshold, what is the average magnitude of that loss?"

**Use & Considerations for CFA Charterholders:**
*   **Better Understanding of Tail Risk:** Unlike VaR, which only indicates a cutoff point, CVaR measures the severity and average of actual losses in the tail of the return distribution. This aids in a deeper understanding of extreme and infrequent losses.
*   **Complements VaR:** CVaR provides more complete information than VaR about the distribution of losses in the critical tail region, offering a more realistic picture of risk.
*   **Preferred in Advanced Risk Management:** Many regulatory bodies and market professionals prefer CVaR over VaR due to its better representation of catastrophic risks and its property of subadditivity (meaning the risk of a portfolio is not greater than the sum of the risks of its components, a property VaR does not always satisfy).
*   **More Informed Decision-Making:** By providing a picture of average extreme losses, it helps investors and risk managers make more informed decisions about asset allocation and risk management.
*   **Calculation:** First, VaR 5% is calculated. Then, all returns less than or equal to this VaR are identified, and their average is taken as CVaR 5%.`
    },
    'omega_label': {
        'fa': "نسبت اُمگا (آستانه: RF)",
        'en': "Omega Ratio (Threshold: RF)"
    },
    'omega_tooltip': {
        'fa': `**نسبت اُمگا (Omega Ratio):**
نسبت امگا یک معیار عملکرد تعدیل شده بر اساس ریسک است که کل توزیع بازده را در نظر می‌گیرد و به مفروضات خاصی در مورد شکل توزیع (مانند نرمال بودن) وابسته نیست. این نسبت، مجموع وزنی بازده‌های مطلوب (بالاتر از یک آستانه، در اینجا نرخ بدون ریسک) را به مجموع وزنی بازده‌های نامطلوب (پایین‌تر از همان آستانه) مقایسه می‌کند.

**کاربرد و ملاحظات برای تحلیلگر مالی (CFA):**
*   **تحلیل جامع ریسک و بازده:** به خصوص برای توزیع‌های بازده غیرنرمال (مثلاً دارای چولگی یا کشیدگی زیاد) مفید است، جایی که معیارهای سنتی مانند نسبت شارپ (که بر میانگین و واریانس تکیه دارند) ممکن است تصویر کاملی از رابطه ریسک و بازده ارائه ندهند.
*   **در نظر گرفتن تمام گشتاورها:** به طور غیرمستقیم تمام ویژگی‌های توزیع بازده (میانگین، واریانس، چولگی، کشیدگی و ...) را در محاسبات خود لحاظ می‌کند و صرفاً به دو گشتاور اول محدود نیست.
*   **انتخاب آستانه (Threshold):** نتیجه نسبت امگا به آستانه انتخاب شده بستگی دارد. استفاده از نرخ بدون ریسک به عنوان آستانه رایج است، اما آستانه‌های دیگری مانند صفر یا حداقل بازده قابل قبول (MAR) نیز می‌توانند استفاده شوند.
*   **تفسیر:** مقدار بالاتر نسبت امگا نشان‌دهنده عملکرد بهتر است. نسبت امگای بزرگتر از ۱ نشان می‌دهد که احتمال و مقدار سودهای بالاتر از آستانه، بیشتر از احتمال و مقدار زیان‌های پایین‌تر از آستانه بوده است.
*   **جایگزین مناسب برای نسبت شارپ:** در شرایطی که مفروضات نسبت شارپ (مانند نرمال بودن بازده یا تقارن توزیع) برقرار نیست، نسبت امگا می‌تواند جایگزین یا مکمل بسیار خوبی باشد.`,
        'en': `**Omega Ratio:**
The Omega ratio is a risk-adjusted performance measure that considers the entire distribution of returns and does not depend on specific assumptions about the shape of the distribution (like normality). It compares the weighted sum of desirable returns (above a threshold, here the risk-free rate) to the weighted sum of undesirable returns (below the same threshold).

**Use & Considerations for CFA Charterholders:**
*   **Comprehensive Risk-Return Analysis:** Particularly useful for non-normal return distributions (e.g., with significant skewness or kurtosis), where traditional metrics like the Sharpe ratio (which rely on mean and variance) may not provide a complete picture of the risk-return trade-off.
*   **Considers All Moments:** Indirectly incorporates all features of the return distribution (mean, variance, skewness, kurtosis, etc.) in its calculation, not just the first two moments.
*   **Threshold Selection:** The Omega ratio result depends on the chosen threshold. Using the risk-free rate as the threshold is common, but other thresholds like zero or a Minimum Acceptable Return (MAR) can also be used.
*   **Interpretation:** A higher Omega ratio indicates better performance. An Omega ratio greater than 1 suggests that the probability and magnitude of gains above the threshold have been greater than the probability and magnitude of losses below the threshold.
*   **Good Alternative to Sharpe Ratio:** In situations where the assumptions of the Sharpe ratio (like normality or symmetry of returns) do not hold, the Omega ratio can be a very good alternative or complement.`
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
