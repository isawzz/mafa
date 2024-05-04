function copi2_navbar() {
	let html = `
				<div class='w3-card-2 topnav notranslate' id='topnav'>
					<div style="overflow:auto;">
						<div class="w3-bar w3-left" style="width:100%;overflow:hidden;height:44px">
							<!-- <a href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ctext x='0' y='1em' font-size='18' fill='%23000'%3E😊%3C/text%3E%3C/svg%3E" class='topnav-icons w3-hide-large w3-left w3-bar-item w3-button'>😊</a> -->
							<a class="w3-bar-item w3-button" href='javascript:void(0);' onclick='open_menu()' title='Menu'>😊</a>
							<!-- <a href='javascript:void(0);' class='topnav-icons w3-hide-large w3-left w3-bar-item w3-button'>😊</a> -->
							<!-- <a href='javascript:void(0);' class='topnav-icons fa fa-menu w3-hide-large w3-left w3-bar-item w3-button' onclick='open_menu()' title='Menu'></a> -->
							<a href='../default.html' class='topnav-icons fa fa-home w3-left w3-bar-item w3-button' title='Home'></a>
							<a class="w3-bar-item w3-button" href='../html/default.html' title='HTML Tutorial'
								style="padding-left:18px!important;padding-right:18px!important;">HTML</a>
							<a class="w3-bar-item w3-button" href='../css/default.html' title='CSS Tutorial'>CSS</a>
							<a class="w3-bar-item w3-button" href='../js/default.html' title='JavaScript Tutorial'>JAVASCRIPT</a>
							<a class="w3-bar-item w3-button" href='../sql/default.html' title='SQL Tutorial'>SQL</a>
							<a class="w3-bar-item w3-button" href='../python/default.html' title='Python Tutorial'>PYTHON</a>
							<a class="w3-bar-item w3-button" href='../java/default.html' title='Java Tutorial'>JAVA</a>
							<a class="w3-bar-item w3-button" href='../php/default.html' title='PHP Tutorial'>PHP</a>
							<a class="w3-bar-item w3-button" href='../bootstrap/bootstrap_ver.html' title='Bootstrap Tutorial'>BOOTSTRAP</a>
							<a class="w3-bar-item w3-button" href='../howto/default.html' title='How To'>HOW TO</a>
							<a class="w3-bar-item w3-button" href='../w3css/default.html' title='W3.CSS Tutorial'>W3.CSS</a>
							<a class="w3-bar-item w3-button" href='../c/index.html' title='C Tutorial'>C</a>
							<a class="w3-bar-item w3-button" href='../cpp/default.html' title='C++ Tutorial'>C++</a>
							<a class="w3-bar-item w3-button" href='../cs/index.html' title='C# Tutorial'>C#</a>
							<a class="w3-bar-item w3-button" href='../react/default.html' title='React Tutorial'>REACT</a>
							<a class="w3-bar-item w3-button" href='../r/default.html' title='R Tutorial'>R</a>
							<a class="w3-bar-item w3-button" href='../jquery/default.html' title='jQuery Tutorial'>JQUERY</a>
							<a class="w3-bar-item w3-button" href='../django/index.html' title='Django Tutorial'>DJANGO</a>
							<a class="w3-bar-item w3-button" href='../typescript/index.html' title='Typescript Tutorial'>TYPESCRIPT</a>
							<a class="w3-bar-item w3-button" href='../nodejs/default.html' title='NodeJS Tutorial'>NODEJS</a>
							<a class="w3-bar-item w3-button" href='../mysql/default.html' title='MySQL Tutorial'>MYSQL</a>
							<a href='javascript:void(0);' class='topnav-icons fa w3-right w3-bar-item w3-button' onclick='gSearch(this)'
								title='Search W3Schools'>&#xe802;</a>
							<a href='javascript:void(0);' class='topnav-icons fa w3-right w3-bar-item w3-button' onclick='gTra(this)'
								title='Translate W3Schools'>&#xe801;</a>
							<!--      <a href='javascript:void(0);' class='topnav-icons fa w3-right w3-bar-item w3-button' onclick='changecodetheme(this)' title='Toggle Dark Code Examples'>&#xe80b;</a>-->
							<a href='javascript:void(0);' class='topnav-icons fa w3-right w3-bar-item w3-button'
								onmouseover="mouseoverdarkicon()" onmouseout="mouseoutofdarkicon()" onclick='changepagetheme(2)'>&#xe80b;</a>


							<!--
						<a class="w3-bar-item w3-button w3-right" id='topnavbtn_exercises' href='javascript:void(0);' onclick='w3_open_nav("exercises")' title='Exercises'>EXERCISES <i class='fa fa-caret-down'></i><i class='fa fa-caret-up' style='display:none'></i></a>
						-->

						</div>

						<div id="darkmodemenu" class="ws-black" onmouseover="mouseoverdarkicon()" onmouseout="mouseoutofdarkicon()">
							<input id="radio_darkpage" type="checkbox" name="radio_theme_mode" onclick="click_darkpage()"><label
								for="radio_darkpage"> Dark mode</label>
							<br>
							<input id="radio_darkcode" type="checkbox" name="radio_theme_mode" onclick="click_darkcode()"><label
								for="radio_darkcode"> Dark code</label>
						</div>

						<nav id="nav_tutorials" class="w3-hide-small" style="position:absolute;padding-bottom:60px;">
							<div class="w3-content" style="max-width:1100px;font-size:18px">
								<span onclick="w3_close_nav('tutorials')"
									class="w3-button w3-xxxlarge w3-display-topright w3-hover-white sectionxsclosenavspan"
									style="padding-right:30px;padding-left:30px;">&times;</span><br>
								<div class="w3-row-padding w3-bar-block">
									<div class="w3-container" style="padding-left:13px">
										<h2 style="color:#FFF4A3;"><b>Tutorials</b></h2>
									</div>
									<div class="w3-col l3 m6">
										<h3 class="w3-margin-top">HTML and CSS</h3>
										<a class="w3-bar-item w3-button" href="../html/default.html">Learn HTML</a>
										<a class="w3-bar-item w3-button" href="../css/default.html">Learn CSS</a>
										<a class="w3-bar-item w3-button" href="../css/css_rwd_intro.html" title="Responsive Web Design">Learn
											RWD</a>
										<a class="w3-bar-item w3-button" href="../bootstrap/bootstrap_ver.html">Learn Bootstrap</a>
										<a class="w3-bar-item w3-button" href="../w3css/default.html">Learn W3.CSS</a>
										<a class="w3-bar-item w3-button" href="default.html">Learn Colors</a>
										<a class="w3-bar-item w3-button" href="../icons/default.html">Learn Icons</a>
										<a class="w3-bar-item w3-button" href="../graphics/default.html">Learn Graphics</a>
										<a class="w3-bar-item w3-button" href='../graphics/svg_intro.html'>Learn SVG</a>
										<a class="w3-bar-item w3-button" href='../graphics/canvas_intro.html'>Learn Canvas</a>
										<a class="w3-bar-item w3-button" href="../howto/default.html">Learn How To</a>
										<a class="w3-bar-item w3-button" href="../sass/default.html">Learn Sass</a>
										<div class="w3-hide-large w3-hide-small">
											<h3 class="w3-margin-top">Data Analytics</h3>
											<a class="w3-bar-item w3-button" href="../ai/default.html">Learn AI</a>
											<a class="w3-bar-item w3-button" href="../python/python_ml_getting_started.html">Learn Machine
												Learning</a>
											<a class="w3-bar-item w3-button" href="../datascience/default.html">Learn Data Science</a>
											<a class="w3-bar-item w3-button" href="../python/numpy/default.html">Learn NumPy</a>
											<a class="w3-bar-item w3-button" href="../python/pandas/default.html">Learn Pandas</a>
											<a class="w3-bar-item w3-button" href="../python/scipy/index.html">Learn SciPy</a>
											<a class="w3-bar-item w3-button" href="../python/matplotlib_intro.html">Learn Matplotlib</a>
											<a class="w3-bar-item w3-button" href="../statistics/index.html">Learn Statistics</a>
											<a class="w3-bar-item w3-button" href="../excel/index.html">Learn Excel</a>

											<h3 class="w3-margin-top">XML Tutorials</h3>
											<a class="w3-bar-item w3-button" href="../xml/default.html">Learn XML</a>
											<a class="w3-bar-item w3-button" href='../xml/ajax_intro.html'>Learn XML AJAX</a>
											<a class="w3-bar-item w3-button" href="../xml/dom_intro.html">Learn XML DOM</a>
											<a class="w3-bar-item w3-button" href='../xml/xml_dtd_intro.html'>Learn XML DTD</a>
											<a class="w3-bar-item w3-button" href='../xml/schema_intro.html'>Learn XML Schema</a>
											<a class="w3-bar-item w3-button" href="../xml/xsl_intro.html">Learn XSLT</a>
											<a class="w3-bar-item w3-button" href='../xml/xpath_intro.html'>Learn XPath</a>
											<a class="w3-bar-item w3-button" href='../xml/xquery_intro.html'>Learn XQuery</a>
										</div>
									</div>
									<div class="w3-col l3 m6">
										<h3 class="w3-margin-top">JavaScript</h3>
										<a class="w3-bar-item w3-button" href="../js/default.html">Learn JavaScript</a>
										<a class="w3-bar-item w3-button" href="../jquery/default.html">Learn jQuery</a>
										<a class="w3-bar-item w3-button" href="../react/default.html">Learn React</a>
										<a class="w3-bar-item w3-button" href="../angular/default.html">Learn AngularJS</a>
										<a class="w3-bar-item w3-button" href="../js/js_json_intro.html">Learn JSON</a>
										<a class="w3-bar-item w3-button" href="../js/js_ajax_intro.html">Learn AJAX</a>
										<a class="w3-bar-item w3-button" href="../appml/default.html">Learn AppML</a>
										<a class="w3-bar-item w3-button" href="../w3js/default.html">Learn W3.JS</a>

										<h3 class="w3-margin-top">Programming</h3>
										<a class="w3-bar-item w3-button" href="../python/default.html">Learn Python</a>
										<a class="w3-bar-item w3-button" href="../java/default.html">Learn Java</a>
										<a class="w3-bar-item w3-button" href="../c/index.html">Learn C</a>
										<a class="w3-bar-item w3-button" href="../cpp/default.html">Learn C++</a>
										<a class="w3-bar-item w3-button" href="../cs/index.html">Learn C#</a>
										<a class="w3-bar-item w3-button" href="../r/default.html">Learn R</a>
										<a class="w3-bar-item w3-button" href="../kotlin/index.html">Learn Kotlin</a>
										<a class="w3-bar-item w3-button" href="../go/index.html">Learn Go</a>
										<a class="w3-bar-item w3-button" href="../django/index.html">Learn Django</a>
										<a class="w3-bar-item w3-button" href="../typescript/index.html">Learn TypeScript</a>
									</div>
									<div class="w3-col l3 m6">
										<h3 class="w3-margin-top">Server Side</h3>
										<a class="w3-bar-item w3-button" href="../sql/default.html">Learn SQL</a>
										<a class="w3-bar-item w3-button" href="../mysql/default.html">Learn MySQL</a>
										<a class="w3-bar-item w3-button" href="../php/default.html">Learn PHP</a>
										<a class="w3-bar-item w3-button" href='../asp/default.html'>Learn ASP</a>
										<a class="w3-bar-item w3-button" href='../nodejs/default.html'>Learn Node.js</a>
										<a class="w3-bar-item w3-button" href='../nodejs/nodejs_raspberrypi.html'>Learn Raspberry Pi</a>
										<a class="w3-bar-item w3-button" href='../git/default.html'>Learn Git</a>
										<a class="w3-bar-item w3-button" href='../mongodb/index.html'>Learn MongoDB</a>
										<a class="w3-bar-item w3-button" href='../aws/index.html'>Learn AWS Cloud</a>

										<h3 class="w3-margin-top">Web Building</h3>
										<a class="w3-bar-item w3-button" href="../spaces/index.html" target="_blank"
											title="Get Your Own Website With W3schools Spaces">Create a Website <span
												class="ribbon-topnav ws-yellow">NEW</span></a>
										<a class="w3-bar-item w3-button" href="../where_to_start.html">Where To Start</a>
										<a class="w3-bar-item w3-button" href="../w3css/w3css_templates.html">Web Templates</a>
										<a class="w3-bar-item w3-button" href="../browsers/default.html">Web Statistics</a>
										<a class="w3-bar-item w3-button" href="../../campus.w3schools.com/index.html">Web Certificates</a>
										<a class="w3-bar-item w3-button" href="../whatis/default.html">Web Development</a>
										<a class="w3-bar-item w3-button" href='../tryit/default.html'>Code Editor</a>
										<a class="w3-bar-item w3-button" href="../typingspeed/default.html">Test Your Typing Speed</a>
										<a class="w3-bar-item w3-button" href="../codegame/index.html" target="_blank">Play a Code Game</a>
										<a class="w3-bar-item w3-button" href="../cybersecurity/index.html">Cyber Security</a>
										<a class="w3-bar-item w3-button" href="../accessibility/index.html">Accessibility</a>
										<a class="w3-bar-item w3-button" href="../../campus.w3schools.com/pages/newsletter.html"
											target="_blank">Join our Newsletter</a>
									</div>
									<div class="w3-col l3 m6 w3-hide-medium">
										<h3 class="w3-margin-top">Data Analytics</h3>
										<a class="w3-bar-item w3-button" href="../ai/default.html">Learn AI</a>
										<a class="w3-bar-item w3-button" href="../python/python_ml_getting_started.html">Learn Machine
											Learning</a>
										<a class="w3-bar-item w3-button" href="../datascience/default.html">Learn Data Science</a>
										<a class="w3-bar-item w3-button" href="../python/numpy/default.html">Learn NumPy</a>
										<a class="w3-bar-item w3-button" href="../python/pandas/default.html">Learn Pandas</a>
										<a class="w3-bar-item w3-button" href="../python/scipy/index.html">Learn SciPy</a>
										<a class="w3-bar-item w3-button" href="../python/matplotlib_intro.html">Learn Matplotlib</a>
										<a class="w3-bar-item w3-button" href="../statistics/index.html">Learn Statistics</a>
										<a class="w3-bar-item w3-button" href="../excel/index.html">Learn Excel</a>
										<a class="w3-bar-item w3-button" href="../googlesheets/index.html">Learn Google Sheets</a>

										<h3 class="w3-margin-top">XML Tutorials</h3>
										<a class="w3-bar-item w3-button" href="../xml/default.html">Learn XML</a>
										<a class="w3-bar-item w3-button" href='../xml/ajax_intro.html'>Learn XML AJAX</a>
										<a class="w3-bar-item w3-button" href="../xml/dom_intro.html">Learn XML DOM</a>
										<a class="w3-bar-item w3-button" href='../xml/xml_dtd_intro.html'>Learn XML DTD</a>
										<a class="w3-bar-item w3-button" href='../xml/schema_intro.html'>Learn XML Schema</a>
										<a class="w3-bar-item w3-button" href="../xml/xsl_intro.html">Learn XSLT</a>
										<a class="w3-bar-item w3-button" href='../xml/xpath_intro.html'>Learn XPath</a>
										<a class="w3-bar-item w3-button" href='../xml/xquery_intro.html'>Learn XQuery</a>
									</div>
								</div>
							</div>
							<br class="hidesm">
						</nav>

						<nav id="nav_references" class="w3-hide-small" style="position:absolute;padding-bottom:60px;">
							<div class="w3-content" style="max-width:1100px;font-size:18px">
								<span onclick="w3_close_nav('references')"
									class="w3-button w3-xxxlarge w3-display-topright w3-hover-white sectionxsclosenavspan"
									style="padding-right:30px;padding-left:30px;">&times;</span><br>
								<div class="w3-row-padding w3-bar-block">
									<div class="w3-container" style="padding-left:13px">
										<h2 style="color:#FFF4A3;"><b>References</b></h2>
									</div>
									<div class="w3-col l3 m6">
										<h3 class="w3-margin-top">HTML</h3>
										<a class="w3-bar-item w3-button" href='../tags/default.html'>HTML Tag Reference</a>
										<a class="w3-bar-item w3-button" href='../tags/ref_html_browsersupport.html'>HTML Browser Support</a>
										<a class="w3-bar-item w3-button" href='../tags/ref_eventattributes.html'>HTML Event Reference</a>
										<a class="w3-bar-item w3-button" href='default.html'>HTML Color Reference</a>
										<a class="w3-bar-item w3-button" href='../tags/ref_attributes.html'>HTML Attribute Reference</a>
										<a class="w3-bar-item w3-button" href='../tags/ref_canvas.html'>HTML Canvas Reference</a>
										<a class="w3-bar-item w3-button" href='../graphics/svg_reference.html'>HTML SVG Reference</a>
										<a class="w3-bar-item w3-button" href='../graphics/google_maps_reference.html'>Google Maps Reference</a>
										<h3 class="w3-margin-top">CSS</h3>
										<a class="w3-bar-item w3-button" href='../cssref/index.html'>CSS Reference</a>
										<a class="w3-bar-item w3-button" href='../cssref/css3_browsersupport.html'>CSS Browser Support</a>
										<a class="w3-bar-item w3-button" href='../cssref/css_selectors.html'>CSS Selector Reference</a>
										<a class="w3-bar-item w3-button" href='../bootstrap/bootstrap_ref_all_classes.html'>Bootstrap 3
											Reference</a>
										<a class="w3-bar-item w3-button" href='../bootstrap4/bootstrap_ref_all_classes.html'>Bootstrap 4
											Reference</a>
										<a class="w3-bar-item w3-button" href='../w3css/w3css_references.html'>W3.CSS Reference</a>
										<a class="w3-bar-item w3-button" href='../icons/icons_reference.html'>Icon Reference</a>
										<a class="w3-bar-item w3-button" href='../sass/sass_functions_string.html'>Sass Reference</a>
									</div>
									<div class="w3-col l3 m6">
										<h3 class="w3-margin-top">JavaScript</h3>
										<a class="w3-bar-item w3-button" href='../jsref/default.html'>JavaScript Reference</a>
										<a class="w3-bar-item w3-button" href='../jsref/default.html'>HTML DOM Reference</a>
										<a class="w3-bar-item w3-button" href='../jquery/jquery_ref_overview.html'>jQuery Reference</a>
										<a class="w3-bar-item w3-button" href='../angular/angular_ref_directives.html'>AngularJS Reference</a>
										<a class="w3-bar-item w3-button" href="../appml/appml_reference.html">AppML Reference</a>
										<a class="w3-bar-item w3-button" href="../w3js/w3js_references.html">W3.JS Reference</a>

										<h3 class="w3-margin-top">Programming</h3>
										<a class="w3-bar-item w3-button" href='../python/python_reference.html'>Python Reference</a>
										<a class="w3-bar-item w3-button" href='../java/java_ref_keywords.html'>Java Reference</a>
									</div>
									<div class="w3-col l3 m6">
										<h3 class="w3-margin-top">Server Side</h3>
										<a class="w3-bar-item w3-button" href='../sql/sql_ref_keywords.html'>SQL Reference</a>
										<a class="w3-bar-item w3-button" href='../mysql/mysql_ref_functions.html'>MySQL Reference</a>
										<a class="w3-bar-item w3-button" href='../php/php_ref_overview.html'>PHP Reference</a>
										<a class="w3-bar-item w3-button" href='../asp/asp_ref_response.html'>ASP Reference</a>
										<h3 class="w3-margin-top">XML</h3>
										<a class="w3-bar-item w3-button" href='../xml/dom_nodetype.html'>XML DOM Reference</a>
										<a class="w3-bar-item w3-button" href='../xml/dom_http.html'>XML Http Reference</a>
										<a class="w3-bar-item w3-button" href='../xml/xsl_elementref.html'>XSLT Reference</a>
										<a class="w3-bar-item w3-button" href='../xml/schema_elements_ref.html'>XML Schema Reference</a>
									</div>
									<div class="w3-col l3 m6">
										<h3 class="w3-margin-top">Character Sets</h3>
										<a class="w3-bar-item w3-button" href='../charsets/default.html'>HTML Character Sets</a>
										<a class="w3-bar-item w3-button" href='../charsets/ref_html_ascii.html'>HTML ASCII</a>
										<a class="w3-bar-item w3-button" href='../charsets/ref_html_ansi.html'>HTML ANSI</a>
										<a class="w3-bar-item w3-button" href='../charsets/ref_html_ansi.html'>HTML Windows-1252</a>
										<a class="w3-bar-item w3-button" href='../charsets/ref_html_8859.html'>HTML ISO-8859-1</a>
										<a class="w3-bar-item w3-button" href='../charsets/ref_html_symbols.html'>HTML Symbols</a>
										<a class="w3-bar-item w3-button" href='../charsets/ref_html_utf8.html'>HTML UTF-8</a>
									</div>
								</div>
								<br class="hidesm">
							</div>
						</nav>

						<nav id="nav_exercises" class="w3-hide-small" style="position:absolute;padding-bottom:60px;">
							<div class="w3-content" style="max-width:1100px;font-size:18px">
								<span onclick="w3_close_nav('exercises')"
									class="w3-button w3-xxxlarge w3-display-topright w3-hover-white sectionxsclosenavspan"
									style="padding-right:30px;padding-left:30px;">&times;</span><br>
								<div class="w3-row-padding w3-bar-block">
									<div class="w3-container" style="padding-left:13px">
										<h2 style="color:#FFF4A3;"><b>Exercises and Quizzes</b></h2>
									</div>
									<div class="w3-col l3 m6">
										<h3 class="w3-margin-top"><a class="ws-btn ws-yellow w3-hover-text-white"
												style="width:155px;font-size:21px" href="../exercises/index.html">Exercises</a></h3>
										<a class="w3-bar-item w3-button" href="../html/html_exercises.html">HTML Exercises</a>
										<a class="w3-bar-item w3-button" href="../css/css_exercises.html">CSS Exercises</a>
										<a class="w3-bar-item w3-button" href="../js/js_exercises.html">JavaScript Exercises</a>
										<a class="w3-bar-item w3-button" href="../python/python_exercises.html">Python Exercises</a>
										<a class="w3-bar-item w3-button" href="../sql/sql_exercises.html">SQL Exercises</a>
										<a class="w3-bar-item w3-button" href="../php/php_exercises.html">PHP Exercises</a>
										<a class="w3-bar-item w3-button" href="../java/java_exercises.html">Java Exercises</a>
										<a class="w3-bar-item w3-button" href="../c/c_exercises.html">C Exercises</a>
										<a class="w3-bar-item w3-button" href="../cpp/cpp_exercises.html">C++ Exercises</a>
										<a class="w3-bar-item w3-button" href="../cs/cs_exercises.html">C# Exercises</a>
										<a class="w3-bar-item w3-button" href="../jquery/jquery_exercises.html">jQuery Exercises</a>
										<a class="w3-bar-item w3-button" href="../react/react_exercises.html">React.js Exercises</a>
										<a class="w3-bar-item w3-button" href="../mysql/mysql_exercises.html">MySQL Exercises</a>
										<a class="w3-bar-item w3-button" href="../bootstrap5/bootstrap_exercises.html">Bootstrap 5 Exercises</a>
										<a class="w3-bar-item w3-button" href="../bootstrap4/bootstrap_exercises.html">Bootstrap 4 Exercises</a>
										<a class="w3-bar-item w3-button" href="../bootstrap/bootstrap_exercises.html">Bootstrap 3 Exercises</a>
										<a class="w3-bar-item w3-button" href="../python/numpy/numpy_exercises.html">NumPy Exercises</a>
										<a class="w3-bar-item w3-button" href="../python/pandas/pandas_exercises.html">Pandas Exercises</a>
										<a class="w3-bar-item w3-button" href="../python/scipy/scipy_exercises.html">SciPy Exercises</a>
										<a class="w3-bar-item w3-button" href="../typescript/typescript_exercises.html">TypeScript Exercises</a>
										<a class="w3-bar-item w3-button" href="../excel/excel_exercises.html">Excel Exercises</a>
										<a class="w3-bar-item w3-button" href="../r/r_exercises.html">R Exercises</a>
										<a class="w3-bar-item w3-button" href="../git/git_exercises.html">Git Exercises</a>
										<a class="w3-bar-item w3-button" href="../kotlin/kotlin_exercises.html">Kotlin Exercises</a>
										<a class="w3-bar-item w3-button" href="../go/go_exercises.html">Go Exercises</a>
										<a class="w3-bar-item w3-button" href="../mongodb/mongodb_exercises.html">MongoDB Exercises</a>
									</div>
									<div class="w3-col l3 m6">
										<h3 class="w3-margin-top"><a class="ws-btn ws-yellow w3-hover-text-white"
												style="width:135px;font-size:21px" href="../quiztest/default.html">Quizzes</a></h3>
										<a class="w3-bar-item w3-button" href="../html/html_quiz.html" target="_top">HTML Quiz</a>
										<a class="w3-bar-item w3-button" href="../css/css_quiz.html" target="_top">CSS Quiz</a>
										<a class="w3-bar-item w3-button" href="../js/js_quiz.html" target="_top">JavaScript Quiz</a>
										<a class="w3-bar-item w3-button" href="../python/python_quiz.html" target="_top">Python Quiz</a>
										<a class="w3-bar-item w3-button" href="../sql/sql_quiz.html" target="_top">SQL Quiz</a>
										<a class="w3-bar-item w3-button" href="../php/php_quiz.html" target="_top">PHP Quiz</a>
										<a class="w3-bar-item w3-button" href="../java/java_quiz.html" target="_top">Java Quiz</a>
										<a class="w3-bar-item w3-button" href="../c/c_quiz.html">C Quiz</a>
										<a class="w3-bar-item w3-button" href="../cpp/cpp_quiz.html" target="_top">C++ Quiz</a>
										<a class="w3-bar-item w3-button" href="../cs/cs_quiz.html" target="_top">C# Quiz</a>
										<a class="w3-bar-item w3-button" href="../jquery/jquery_quiz.html" target="_top">jQuery Quiz</a>
										<a class="w3-bar-item w3-button" href="../react/react_quiz.html">React.js Quiz</a>
										<a class="w3-bar-item w3-button" href="../mysql/mysql_quiz.html" target="_top">MySQL Quiz</a>
										<a class="w3-bar-item w3-button" href="../bootstrap5/bootstrap_quiz.html" target="_top">Bootstrap 5
											Quiz</a>
										<a class="w3-bar-item w3-button" href="../bootstrap4/bootstrap_quiz.html" target="_top">Bootstrap 4
											Quiz</a>
										<a class="w3-bar-item w3-button" href="../bootstrap/bootstrap_quiz.html" target="_top">Bootstrap 3
											Quiz</a>
										<a class="w3-bar-item w3-button" href="../python/numpy/numpy_quiz.html" target="_top">NumPy Quiz</a>
										<a class="w3-bar-item w3-button" href="../python/pandas/pandas_quiz.html" target="_top">Pandas Quiz</a>
										<a class="w3-bar-item w3-button" href="../python/scipy/scipy_quiz.html" target="_top">SciPy Quiz</a>
										<a class="w3-bar-item w3-button" href="../typescript/typescript_quiz.html">TypeScript Quiz</a>
										<a class="w3-bar-item w3-button" href="../xml/xml_quiz.html" target="_top">XML Quiz</a>
										<a class="w3-bar-item w3-button" href="../r/r_quiz.html" target="_top">R Quiz</a>
										<a class="w3-bar-item w3-button" href="../git/git_quiz.html">Git Quiz</a>
										<a class="w3-bar-item w3-button" href="../kotlin/kotlin_quiz.html" target="_top">Kotlin Quiz</a>
										<a class="w3-bar-item w3-button" href="../cybersecurity/cybersecurity_quiz.html">Cyber Security Quiz</a>
										<a class="w3-bar-item w3-button" href="../accessibility/accessibility_quiz.html">Accessibility Quiz</a>
									</div>
									<div class="w3-col l3 m6">
										<h3 class="w3-margin-top"><a class="ws-btn ws-yellow w3-hover-text-white"
												style="width:135px;font-size:21px" href="../../campus.w3schools.com/collections/course-catalog.html"
												target="_blank">Courses</a></h3>
										<a class="w3-bar-item w3-button"
											href="../../campus.w3schools.com/collections/course-catalog/products/html-course.html"
											target="_blank">HTML Course</a>
										<a class="w3-bar-item w3-button"
											href="../../campus.w3schools.com/collections/course-catalog/products/css-course.html"
											target="_blank">CSS Course</a>
										<a class="w3-bar-item w3-button"
											href="../../campus.w3schools.com/collections/course-catalog/products/javascript-course.html"
											target="_blank">JavaScript Course</a>
										<a class="w3-bar-item w3-button"
											href="../../campus.w3schools.com/collections/course-catalog/products/front-end-course.html"
											target="_blank">Front End Course</a>
										<a class="w3-bar-item w3-button"
											href="../../campus.w3schools.com/collections/course-catalog/products/python-course.html"
											target="_blank">Python Course</a>
										<a class="w3-bar-item w3-button"
											href="../../campus.w3schools.com/collections/course-catalog/products/sql-course.html"
											target="_blank">SQL Course</a>
										<a class="w3-bar-item w3-button"
											href="../../campus.w3schools.com/collections/course-catalog/products/php-course.html"
											target="_blank">PHP Course</a>
										<a class="w3-bar-item w3-button"
											href="../../campus.w3schools.com/collections/course-catalog/products/java-course.html"
											target="_blank">Java Course</a>
										<a class="w3-bar-item w3-button"
											href="../../campus.w3schools.com/collections/course-catalog/products/c-course-1.html"
											target="_blank">C++ Course</a>
										<a class="w3-bar-item w3-button"
											href="../../campus.w3schools.com/collections/course-catalog/products/c-course.html" target="_blank">C#
											Course</a>
										<a class="w3-bar-item w3-button"
											href="../../campus.w3schools.com/collections/course-catalog/products/jquery-course.html"
											target="_blank">jQuery Course</a>
										<a class="w3-bar-item w3-button"
											href="../../campus.w3schools.com/collections/course-catalog/products/react-js-course.html"
											target="_blank">React.js Course</a>
										<a class="w3-bar-item w3-button"
											href="../../campus.w3schools.com/collections/course-catalog/products/bootstrap-4-course.html"
											target="_blank">Bootstrap 4 Course</a>
										<a class="w3-bar-item w3-button"
											href="../../campus.w3schools.com/collections/course-catalog/products/bootstrap-course.html"
											target="_blank">Bootstrap 3 Course</a>
										<a class="w3-bar-item w3-button"
											href="../../campus.w3schools.com/collections/course-catalog/products/numpy-course.html"
											target="_blank">NumPy Course</a>
										<a class="w3-bar-item w3-button"
											href="../../campus.w3schools.com/collections/course-catalog/products/pandas-course.html"
											target="_blank">Pandas Course</a>
										<a class="w3-bar-item w3-button"
											href="../../campus.w3schools.com/collections/course-catalog/products/learn-typescript.html"
											target="_blank">TypeScript Course</a>
										<a class="w3-bar-item w3-button"
											href="../../campus.w3schools.com/collections/course-catalog/products/xml-course.html"
											target="_blank">XML Course</a>
										<a class="w3-bar-item w3-button"
											href="../../campus.w3schools.com/collections/course-catalog/products/r-course.html" target="_blank">R
											Course</a>
										<a class="w3-bar-item w3-button"
											href="../../campus.w3schools.com/collections/course-catalog/products/data-analytics-program.html"
											target="_blank">Data Analytics Course</a>
										<a class="w3-bar-item w3-button"
											href="../../campus.w3schools.com/collections/course-catalog/products/cyber-security-course.html"
											target="_blank">Cyber Security Course</a>
										<a class="w3-bar-item w3-button"
											href="../../campus.w3schools.com/collections/course-catalog/products/accessibility-course.html"
											target="_blank">Accessibility Course</a>
									</div>
									<div class="w3-col l3 m6">
										<h3 class="w3-margin-top"><a class="ws-btn ws-yellow w3-hover-text-white"
												style="width:150px;font-size:21px" href="../../campus.w3schools.com/collections/certifications.html"
												target="_blank">Certificates</a></h3>
										<a class="w3-bar-item w3-button"
											href="../../campus.w3schools.com/collections/certifications/products/html-certificate.html"
											target="_blank">HTML Certificate</a>
										<a class="w3-bar-item w3-button"
											href="../../campus.w3schools.com/collections/certifications/products/css-certificate.html"
											target="_blank">CSS Certificate</a>
										<a class="w3-bar-item w3-button"
											href="../../campus.w3schools.com/collections/certifications/products/javascript-certificate.html"
											target="_blank">JavaScript Certificate</a>
										<a class="w3-bar-item w3-button"
											href="../../campus.w3schools.com/collections/certifications/products/front-end-certificate.html"
											target="_blank">Front End Certificate</a>
										<a class="w3-bar-item w3-button"
											href="../../campus.w3schools.com/collections/certifications/products/python-certificate.html"
											target="_blank">Python Certificate</a>
										<a class="w3-bar-item w3-button"
											href="../../campus.w3schools.com/collections/certifications/products/sql-certificate.html"
											target="_blank">SQL Certificate</a>
										<a class="w3-bar-item w3-button"
											href="../../campus.w3schools.com/collections/certifications/products/php-certificate.html"
											target="_blank">PHP Certificate</a>
										<a class="w3-bar-item w3-button"
											href="../../campus.w3schools.com/collections/certifications/products/java-certificate.html"
											target="_blank">Java Certificate</a>
										<a class="w3-bar-item w3-button"
											href="../../campus.w3schools.com/collections/certifications/products/c-certificate.html"
											target="_blank">C++ Certificate</a>
										<a class="w3-bar-item w3-button"
											href="../../campus.w3schools.com/collections/certifications/products/c-certificate-1.html"
											target="_blank">C# Certificate</a>
										<a class="w3-bar-item w3-button"
											href="../../campus.w3schools.com/collections/certifications/products/jquery-certificate.html"
											target="_blank">jQuery Certificate</a>
										<a class="w3-bar-item w3-button"
											href="../../campus.w3schools.com/collections/certifications/products/react-js-certificate.html"
											target="_blank">React.js Certificate</a>
										<a class="w3-bar-item w3-button"
											href="../../campus.w3schools.com/collections/certifications/products/mysql-certificate.html"
											target="_blank">MySQL Certificate</a>
										<a class="w3-bar-item w3-button"
											href="../../campus.w3schools.com/collections/certifications/products/bootstrap-5-certificate.html"
											target="_blank">Bootstrap 5 Certificate</a>
										<a class="w3-bar-item w3-button"
											href="../../campus.w3schools.com/collections/certifications/products/bootstrap-4-certificate.html"
											target="_blank">Bootstrap 4 Certificate</a>
										<a class="w3-bar-item w3-button"
											href="../../campus.w3schools.com/collections/certifications/products/bootstrap-3-certificate.html"
											target="_blank">Bootstrap 3 Certificate</a>
										<a class="w3-bar-item w3-button"
											href="../../campus.w3schools.com/collections/certifications/products/typescript-certificate.html"
											target="_blank">TypeScript Certificate</a>
										<a class="w3-bar-item w3-button"
											href="../../campus.w3schools.com/collections/certifications/products/xml-certificate.html"
											target="_blank">XML Certificate</a>
										<a class="w3-bar-item w3-button"
											href="../../campus.w3schools.com/collections/certifications/products/excel-certificate.html"
											target="_blank">Excel Certificate</a>
										<a class="w3-bar-item w3-button"
											href="../../campus.w3schools.com/collections/certifications/products/data-science-certificate.html"
											target="_blank">Data Science Certificate</a>
										<a class="w3-bar-item w3-button"
											href="../../campus.w3schools.com/collections/certifications/products/cyber-security-certificate.html"
											target="_blank">Cyber Security Certificate</a>
										<a class="w3-bar-item w3-button"
											href="../../campus.w3schools.com/collections/certifications/products/accessibility-certificate.html"
											target="_blank">Accessibility Certificate</a>
									</div>
								</div>
								<br class="hidesm">
							</div>
						</nav>

					</div>
				</div>

		`;
	return mCreateFrom(html);
}
function copi2_sidebar() {
	let html = `
		<div class='w3-sidebar w3-collapse' id='sidenav'>
			<div id='leftmenuinner'>
				<div id='leftmenuinnerinner'>
					<!--  <a href='javascript:void(0)' onclick='close_menu()' class='w3-button w3-hide-large w3-large w3-display-topright' style='right:16px;padding:3px 12px;font-weight:bold;'>&times;</a>-->
					<h2 class="left"><span class="left_h2">Colors</span> Tutorial</h2>
					<a target="_top" href="default.html">Colors HOME</a>
					<a target="_top" href="colors_names.html">Color Names</a>
					<a target="_top" href="colors_hex.html">Color Values</a>
					<a target="_top" href="colors_groups.html">Color Groups</a>
					<a target="_top" href="colors_shades.html">Color Shades</a>
					<a target="_top" href="colors_picker.html">Color Picker</a>
					<a target="_top" href="colors_mixer.html">Color Mixer</a>
					<a target="_top" href="colors_converter.html">Color Converter</a>
					<a target="_top" href="colors_rgb.html">Color RGB</a>
					<a target="_top" href="colors_hexadecimal.html">Color HEX</a>
					<a target="_top" href="colors_hsl.html">Color HSL</a>
					<a target="_top" href="colors_hwb.html">Color HWB</a>
					<a target="_top" href="colors_cmyk.html">Color CMYK</a>
					<a target="_top" href="colors_ncol.html">Color NCol</a>
					<a target="_top" href="colors_gradient.html">Color Gradient</a>
					<a target="_top" href="colors_theory.html">Color Theory</a>
					<a target="_top" href="colors_wheels.html">Color Wheels</a>
					<a target="_top" href="colors_currentcolor.html">Color currentcolor</a>
					<a target="_top" href="colors_hues.html">Color Hues</a>
					<a target="_top" href="colors_schemes.html">Color Schemes</a>
					<a target="_top" href="colors_palettes.html">Color Palettes</a>
					<a target="_top" href="colors_brands.html">Color Brands</a>
					<a target="_top" href="colors_w3css.html">Color W3.CSS</a>
					<a target="_top" href="colors_metro.html">Color Metro UI</a>
					<a target="_top" href="colors_win8.html">Color Win8</a>
					<a target="_top" href="colors_flatui.html">Color Flat UI</a>
					<a target="_top" href="colors_psychology.html">Color Psychology</a>
					<br>
					<h2 class="left"><span class="left_h2">Color</span> Schemes</h2>
					<a target="_top" href="colors_monochromatic.html">Colors Monochromatic</a>
					<a target="_top" href="colors_analogous.html">Colors Analogous</a>
					<a target="_top" href="colors_complementary.html">Colors Complementary</a>
					<a target="_top" href="colors_triadic.html">Colors Triadic</a>
					<a target="_top" href="colors_compound.html">Colors Compound</a>
					<br>
					<h2 class="left"><span class="left_h2">Color</span> Trends</h2>
					<a target="_top" href="colors_trends.html">Colors of the Year</a>
					<a target="_top" href="colors_2021.html">Colors 2021</a>
					<a target="_top" href="colors_2020.html">Colors 2020</a>
					<a target="_top" href="colors_2019.html">Colors 2019</a>
					<a target="_top" href="colors_2018.html">Colors 2018</a>
					<a target="_top" href="colors_2017.html">Colors 2017</a>
					<a target="_top" href="colors_2016.html">Colors 2016</a>
					<br>
					<h2 class="left"><span class="left_h2">Color</span> Standards</h2>
					<a target="_top" href="colors_fs595.html">Colors USA</a>
					<a target="_top" href="colors_british.html">Colors UK</a>
					<a target="_top" href="colors_australia.html">Colors Australia</a>
					<a target="_top" href="colors_ral.html">Colors RAL</a>
					<a target="_top" href="colors_nbs.html">Colors NBS</a>
					<a target="_top" href="colors_ncs.html">Colors NCS</a>
					<a target="_top" href="colors_x11.html">Colors X11</a>
					<a target="_top" href="colors_crayola.html">Colors Crayola</a>
					<a target="_top" href="colors_resene.html">Colors Resene</a>
					<a target="_top" href="colors_xkcd.html">Colors XKCD</a>
					<br><br>
				</div>
			</div>
		</div>
		`;
	return mCreateFrom(html);
}
function copi2_maindivs() {
	let html = `
		<div class='w3-main w3-light-grey' id='belowtopnav' style='margin-left:220px;'>
			<div class='w3-row w3-white'>
				<div class='w3-col l10 m12 xmain' id='dMain'>
				</div>
			</div>
		</div>

	`;
	return mCreateFrom(html);
}
function copi2_title() {
	let html = `
		<h1>HTML <span class="color_h1">Color Picker</span></h1>

	`;
	return mCreateFrom(html);
}
function copi2_prevNextButtons() {
	let html = `
		<div class="w3-clear nextprev">
			<a class="w3-left w3-btn" href="colors_shades.html">&#10094; Previous</a>
			<a class="w3-right w3-btn" href="colors_mixer.html">Next &#10095;</a>
		</div>
		`;
	return mCreateFrom(html);
}
function copi2_horizontalLine() { let html = `<hr>`; return mCreateFrom(html); }
function copi2_row() { let html = `<div class="w3-row"></div>`; return mCreateFrom(html); }
function copi2_col() { let html = `<div class="w3-col colorthird1" style="text-align:center;"></div>`; return mCreateFrom(html); }
function copi2_titleh3(s) { let html = `<h3>${s}</h3>`; return mCreateFrom(html); }






function copi2_part() {
	let html = `

		`;
	return mCreateFrom(html);
}

function copi2_part() {
	let html = `

		`;
	return mCreateFrom(html);
}











