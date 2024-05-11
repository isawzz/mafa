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

function copi2_imgForUsemap(src, usemapName) { let html = `<img style='margin-right:2px;' src=${src} usemap='#${usemapName}' alt='usemapName' />`; return mCreateFrom(html); }
function copi2_usemap(usemapName) {
	let html = `
				<map id='${usemapName}' name='${usemapName}' onmouseout='mouseOutMap()'><area style='cursor:pointer' shape='poly'
					coords='63,0,72,4,72,15,63,19,54,15,54,4' onclick='clickColor("#003366",-200,54)'
					onmouseover='mouseOverColor("#003366")' alt='#003366' /><area style='cursor:pointer' shape='poly'
					coords='81,0,90,4,90,15,81,19,72,15,72,4' onclick='clickColor("#336699",-200,72)'
					onmouseover='mouseOverColor("#336699")' alt='#336699' /><area style='cursor:pointer' shape='poly'
					coords='99,0,108,4,108,15,99,19,90,15,90,4' onclick='clickColor("#3366CC",-200,90)'
					onmouseover='mouseOverColor("#3366CC")' alt='#3366CC' /><area style='cursor:pointer' shape='poly'
					coords='117,0,126,4,126,15,117,19,108,15,108,4' onclick='clickColor("#003399",-200,108)'
					onmouseover='mouseOverColor("#003399")' alt='#003399' /><area style='cursor:pointer' shape='poly'
					coords='135,0,144,4,144,15,135,19,126,15,126,4' onclick='clickColor("#000099",-200,126)'
					onmouseover='mouseOverColor("#000099")' alt='#000099' /><area style='cursor:pointer' shape='poly'
					coords='153,0,162,4,162,15,153,19,144,15,144,4' onclick='clickColor("#0000CC",-200,144)'
					onmouseover='mouseOverColor("#0000CC")' alt='#0000CC' /><area style='cursor:pointer' shape='poly'
					coords='171,0,180,4,180,15,171,19,162,15,162,4' onclick='clickColor("#000066",-200,162)'
					onmouseover='mouseOverColor("#000066")' alt='#000066' /><area style='cursor:pointer' shape='poly'
					coords='54,15,63,19,63,30,54,34,45,30,45,19' onclick='clickColor("#006666",-185,45)'
					onmouseover='mouseOverColor("#006666")' alt='#006666' /><area style='cursor:pointer' shape='poly'
					coords='72,15,81,19,81,30,72,34,63,30,63,19' onclick='clickColor("#006699",-185,63)'
					onmouseover='mouseOverColor("#006699")' alt='#006699' /><area style='cursor:pointer' shape='poly'
					coords='90,15,99,19,99,30,90,34,81,30,81,19' onclick='clickColor("#0099CC",-185,81)'
					onmouseover='mouseOverColor("#0099CC")' alt='#0099CC' /><area style='cursor:pointer' shape='poly'
					coords='108,15,117,19,117,30,108,34,99,30,99,19' onclick='clickColor("#0066CC",-185,99)'
					onmouseover='mouseOverColor("#0066CC")' alt='#0066CC' /><area style='cursor:pointer' shape='poly'
					coords='126,15,135,19,135,30,126,34,117,30,117,19' onclick='clickColor("#0033CC",-185,117)'
					onmouseover='mouseOverColor("#0033CC")' alt='#0033CC' /><area style='cursor:pointer' shape='poly'
					coords='144,15,153,19,153,30,144,34,135,30,135,19' onclick='clickColor("#0000FF",-185,135)'
					onmouseover='mouseOverColor("#0000FF")' alt='#0000FF' /><area style='cursor:pointer' shape='poly'
					coords='162,15,171,19,171,30,162,34,153,30,153,19' onclick='clickColor("#3333FF",-185,153)'
					onmouseover='mouseOverColor("#3333FF")' alt='#3333FF' /><area style='cursor:pointer' shape='poly'
					coords='180,15,189,19,189,30,180,34,171,30,171,19' onclick='clickColor("#333399",-185,171)'
					onmouseover='mouseOverColor("#333399")' alt='#333399' /><area style='cursor:pointer' shape='poly'
					coords='45,30,54,34,54,45,45,49,36,45,36,34' onclick='clickColor("#669999",-170,36)'
					onmouseover='mouseOverColor("#669999")' alt='#669999' /><area style='cursor:pointer' shape='poly'
					coords='63,30,72,34,72,45,63,49,54,45,54,34' onclick='clickColor("#009999",-170,54)'
					onmouseover='mouseOverColor("#009999")' alt='#009999' /><area style='cursor:pointer' shape='poly'
					coords='81,30,90,34,90,45,81,49,72,45,72,34' onclick='clickColor("#33CCCC",-170,72)'
					onmouseover='mouseOverColor("#33CCCC")' alt='#33CCCC' /><area style='cursor:pointer' shape='poly'
					coords='99,30,108,34,108,45,99,49,90,45,90,34' onclick='clickColor("#00CCFF",-170,90)'
					onmouseover='mouseOverColor("#00CCFF")' alt='#00CCFF' /><area style='cursor:pointer' shape='poly'
					coords='117,30,126,34,126,45,117,49,108,45,108,34' onclick='clickColor("#0099FF",-170,108)'
					onmouseover='mouseOverColor("#0099FF")' alt='#0099FF' /><area style='cursor:pointer' shape='poly'
					coords='135,30,144,34,144,45,135,49,126,45,126,34' onclick='clickColor("#0066FF",-170,126)'
					onmouseover='mouseOverColor("#0066FF")' alt='#0066FF' /><area style='cursor:pointer' shape='poly'
					coords='153,30,162,34,162,45,153,49,144,45,144,34' onclick='clickColor("#3366FF",-170,144)'
					onmouseover='mouseOverColor("#3366FF")' alt='#3366FF' /><area style='cursor:pointer' shape='poly'
					coords='171,30,180,34,180,45,171,49,162,45,162,34' onclick='clickColor("#3333CC",-170,162)'
					onmouseover='mouseOverColor("#3333CC")' alt='#3333CC' /><area style='cursor:pointer' shape='poly'
					coords='189,30,198,34,198,45,189,49,180,45,180,34' onclick='clickColor("#666699",-170,180)'
					onmouseover='mouseOverColor("#666699")' alt='#666699' /><area style='cursor:pointer' shape='poly'
					coords='36,45,45,49,45,60,36,64,27,60,27,49' onclick='clickColor("#339966",-155,27)'
					onmouseover='mouseOverColor("#339966")' alt='#339966' /><area style='cursor:pointer' shape='poly'
					coords='54,45,63,49,63,60,54,64,45,60,45,49' onclick='clickColor("#00CC99",-155,45)'
					onmouseover='mouseOverColor("#00CC99")' alt='#00CC99' /><area style='cursor:pointer' shape='poly'
					coords='72,45,81,49,81,60,72,64,63,60,63,49' onclick='clickColor("#00FFCC",-155,63)'
					onmouseover='mouseOverColor("#00FFCC")' alt='#00FFCC' /><area style='cursor:pointer' shape='poly'
					coords='90,45,99,49,99,60,90,64,81,60,81,49' onclick='clickColor("#00FFFF",-155,81)'
					onmouseover='mouseOverColor("#00FFFF")' alt='#00FFFF' /><area style='cursor:pointer' shape='poly'
					coords='108,45,117,49,117,60,108,64,99,60,99,49' onclick='clickColor("#33CCFF",-155,99)'
					onmouseover='mouseOverColor("#33CCFF")' alt='#33CCFF' /><area style='cursor:pointer' shape='poly'
					coords='126,45,135,49,135,60,126,64,117,60,117,49' onclick='clickColor("#3399FF",-155,117)'
					onmouseover='mouseOverColor("#3399FF")' alt='#3399FF' /><area style='cursor:pointer' shape='poly'
					coords='144,45,153,49,153,60,144,64,135,60,135,49' onclick='clickColor("#6699FF",-155,135)'
					onmouseover='mouseOverColor("#6699FF")' alt='#6699FF' /><area style='cursor:pointer' shape='poly'
					coords='162,45,171,49,171,60,162,64,153,60,153,49' onclick='clickColor("#6666FF",-155,153)'
					onmouseover='mouseOverColor("#6666FF")' alt='#6666FF' /><area style='cursor:pointer' shape='poly'
					coords='180,45,189,49,189,60,180,64,171,60,171,49' onclick='clickColor("#6600FF",-155,171)'
					onmouseover='mouseOverColor("#6600FF")' alt='#6600FF' /><area style='cursor:pointer' shape='poly'
					coords='198,45,207,49,207,60,198,64,189,60,189,49' onclick='clickColor("#6600CC",-155,189)'
					onmouseover='mouseOverColor("#6600CC")' alt='#6600CC' /><area style='cursor:pointer' shape='poly'
					coords='27,60,36,64,36,75,27,79,18,75,18,64' onclick='clickColor("#339933",-140,18)'
					onmouseover='mouseOverColor("#339933")' alt='#339933' /><area style='cursor:pointer' shape='poly'
					coords='45,60,54,64,54,75,45,79,36,75,36,64' onclick='clickColor("#00CC66",-140,36)'
					onmouseover='mouseOverColor("#00CC66")' alt='#00CC66' /><area style='cursor:pointer' shape='poly'
					coords='63,60,72,64,72,75,63,79,54,75,54,64' onclick='clickColor("#00FF99",-140,54)'
					onmouseover='mouseOverColor("#00FF99")' alt='#00FF99' /><area style='cursor:pointer' shape='poly'
					coords='81,60,90,64,90,75,81,79,72,75,72,64' onclick='clickColor("#66FFCC",-140,72)'
					onmouseover='mouseOverColor("#66FFCC")' alt='#66FFCC' /><area style='cursor:pointer' shape='poly'
					coords='99,60,108,64,108,75,99,79,90,75,90,64' onclick='clickColor("#66FFFF",-140,90)'
					onmouseover='mouseOverColor("#66FFFF")' alt='#66FFFF' /><area style='cursor:pointer' shape='poly'
					coords='117,60,126,64,126,75,117,79,108,75,108,64' onclick='clickColor("#66CCFF",-140,108)'
					onmouseover='mouseOverColor("#66CCFF")' alt='#66CCFF' /><area style='cursor:pointer' shape='poly'
					coords='135,60,144,64,144,75,135,79,126,75,126,64' onclick='clickColor("#99CCFF",-140,126)'
					onmouseover='mouseOverColor("#99CCFF")' alt='#99CCFF' /><area style='cursor:pointer' shape='poly'
					coords='153,60,162,64,162,75,153,79,144,75,144,64' onclick='clickColor("#9999FF",-140,144)'
					onmouseover='mouseOverColor("#9999FF")' alt='#9999FF' /><area style='cursor:pointer' shape='poly'
					coords='171,60,180,64,180,75,171,79,162,75,162,64' onclick='clickColor("#9966FF",-140,162)'
					onmouseover='mouseOverColor("#9966FF")' alt='#9966FF' /><area style='cursor:pointer' shape='poly'
					coords='189,60,198,64,198,75,189,79,180,75,180,64' onclick='clickColor("#9933FF",-140,180)'
					onmouseover='mouseOverColor("#9933FF")' alt='#9933FF' /><area style='cursor:pointer' shape='poly'
					coords='207,60,216,64,216,75,207,79,198,75,198,64' onclick='clickColor("#9900FF",-140,198)'
					onmouseover='mouseOverColor("#9900FF")' alt='#9900FF' /><area style='cursor:pointer' shape='poly'
					coords='18,75,27,79,27,90,18,94,9,90,9,79' onclick='clickColor("#006600",-125,9)'
					onmouseover='mouseOverColor("#006600")' alt='#006600' /><area style='cursor:pointer' shape='poly'
					coords='36,75,45,79,45,90,36,94,27,90,27,79' onclick='clickColor("#00CC00",-125,27)'
					onmouseover='mouseOverColor("#00CC00")' alt='#00CC00' /><area style='cursor:pointer' shape='poly'
					coords='54,75,63,79,63,90,54,94,45,90,45,79' onclick='clickColor("#00FF00",-125,45)'
					onmouseover='mouseOverColor("#00FF00")' alt='#00FF00' /><area style='cursor:pointer' shape='poly'
					coords='72,75,81,79,81,90,72,94,63,90,63,79' onclick='clickColor("#66FF99",-125,63)'
					onmouseover='mouseOverColor("#66FF99")' alt='#66FF99' /><area style='cursor:pointer' shape='poly'
					coords='90,75,99,79,99,90,90,94,81,90,81,79' onclick='clickColor("#99FFCC",-125,81)'
					onmouseover='mouseOverColor("#99FFCC")' alt='#99FFCC' /><area style='cursor:pointer' shape='poly'
					coords='108,75,117,79,117,90,108,94,99,90,99,79' onclick='clickColor("#CCFFFF",-125,99)'
					onmouseover='mouseOverColor("#CCFFFF")' alt='#CCFFFF' /><area style='cursor:pointer' shape='poly'
					coords='126,75,135,79,135,90,126,94,117,90,117,79' onclick='clickColor("#CCCCFF",-125,117)'
					onmouseover='mouseOverColor("#CCCCFF")' alt='#CCCCFF' /><area style='cursor:pointer' shape='poly'
					coords='144,75,153,79,153,90,144,94,135,90,135,79' onclick='clickColor("#CC99FF",-125,135)'
					onmouseover='mouseOverColor("#CC99FF")' alt='#CC99FF' /><area style='cursor:pointer' shape='poly'
					coords='162,75,171,79,171,90,162,94,153,90,153,79' onclick='clickColor("#CC66FF",-125,153)'
					onmouseover='mouseOverColor("#CC66FF")' alt='#CC66FF' /><area style='cursor:pointer' shape='poly'
					coords='180,75,189,79,189,90,180,94,171,90,171,79' onclick='clickColor("#CC33FF",-125,171)'
					onmouseover='mouseOverColor("#CC33FF")' alt='#CC33FF' /><area style='cursor:pointer' shape='poly'
					coords='198,75,207,79,207,90,198,94,189,90,189,79' onclick='clickColor("#CC00FF",-125,189)'
					onmouseover='mouseOverColor("#CC00FF")' alt='#CC00FF' /><area style='cursor:pointer' shape='poly'
					coords='216,75,225,79,225,90,216,94,207,90,207,79' onclick='clickColor("#9900CC",-125,207)'
					onmouseover='mouseOverColor("#9900CC")' alt='#9900CC' /><area style='cursor:pointer' shape='poly'
					coords='9,90,18,94,18,105,9,109,0,105,0,94' onclick='clickColor("#003300",-110,0)'
					onmouseover='mouseOverColor("#003300")' alt='#003300' /><area style='cursor:pointer' shape='poly'
					coords='27,90,36,94,36,105,27,109,18,105,18,94' onclick='clickColor("#009933",-110,18)'
					onmouseover='mouseOverColor("#009933")' alt='#009933' /><area style='cursor:pointer' shape='poly'
					coords='45,90,54,94,54,105,45,109,36,105,36,94' onclick='clickColor("#33CC33",-110,36)'
					onmouseover='mouseOverColor("#33CC33")' alt='#33CC33' /><area style='cursor:pointer' shape='poly'
					coords='63,90,72,94,72,105,63,109,54,105,54,94' onclick='clickColor("#66FF66",-110,54)'
					onmouseover='mouseOverColor("#66FF66")' alt='#66FF66' /><area style='cursor:pointer' shape='poly'
					coords='81,90,90,94,90,105,81,109,72,105,72,94' onclick='clickColor("#99FF99",-110,72)'
					onmouseover='mouseOverColor("#99FF99")' alt='#99FF99' /><area style='cursor:pointer' shape='poly'
					coords='99,90,108,94,108,105,99,109,90,105,90,94' onclick='clickColor("#CCFFCC",-110,90)'
					onmouseover='mouseOverColor("#CCFFCC")' alt='#CCFFCC' /><area style='cursor:pointer' shape='poly'
					coords='117,90,126,94,126,105,117,109,108,105,108,94' onclick='clickColor("#FFFFFF",-110,108)'
					onmouseover='mouseOverColor("#FFFFFF")' alt='#FFFFFF' /><area style='cursor:pointer' shape='poly'
					coords='135,90,144,94,144,105,135,109,126,105,126,94' onclick='clickColor("#FFCCFF",-110,126)'
					onmouseover='mouseOverColor("#FFCCFF")' alt='#FFCCFF' /><area style='cursor:pointer' shape='poly'
					coords='153,90,162,94,162,105,153,109,144,105,144,94' onclick='clickColor("#FF99FF",-110,144)'
					onmouseover='mouseOverColor("#FF99FF")' alt='#FF99FF' /><area style='cursor:pointer' shape='poly'
					coords='171,90,180,94,180,105,171,109,162,105,162,94' onclick='clickColor("#FF66FF",-110,162)'
					onmouseover='mouseOverColor("#FF66FF")' alt='#FF66FF' /><area style='cursor:pointer' shape='poly'
					coords='189,90,198,94,198,105,189,109,180,105,180,94' onclick='clickColor("#FF00FF",-110,180)'
					onmouseover='mouseOverColor("#FF00FF")' alt='#FF00FF' /><area style='cursor:pointer' shape='poly'
					coords='207,90,216,94,216,105,207,109,198,105,198,94' onclick='clickColor("#CC00CC",-110,198)'
					onmouseover='mouseOverColor("#CC00CC")' alt='#CC00CC' /><area style='cursor:pointer' shape='poly'
					coords='225,90,234,94,234,105,225,109,216,105,216,94' onclick='clickColor("#660066",-110,216)'
					onmouseover='mouseOverColor("#660066")' alt='#660066' /><area style='cursor:pointer' shape='poly'
					coords='18,105,27,109,27,120,18,124,9,120,9,109' onclick='clickColor("#336600",-95,9)'
					onmouseover='mouseOverColor("#336600")' alt='#336600' /><area style='cursor:pointer' shape='poly'
					coords='36,105,45,109,45,120,36,124,27,120,27,109' onclick='clickColor("#009900",-95,27)'
					onmouseover='mouseOverColor("#009900")' alt='#009900' /><area style='cursor:pointer' shape='poly'
					coords='54,105,63,109,63,120,54,124,45,120,45,109' onclick='clickColor("#66FF33",-95,45)'
					onmouseover='mouseOverColor("#66FF33")' alt='#66FF33' /><area style='cursor:pointer' shape='poly'
					coords='72,105,81,109,81,120,72,124,63,120,63,109' onclick='clickColor("#99FF66",-95,63)'
					onmouseover='mouseOverColor("#99FF66")' alt='#99FF66' /><area style='cursor:pointer' shape='poly'
					coords='90,105,99,109,99,120,90,124,81,120,81,109' onclick='clickColor("#CCFF99",-95,81)'
					onmouseover='mouseOverColor("#CCFF99")' alt='#CCFF99' /><area style='cursor:pointer' shape='poly'
					coords='108,105,117,109,117,120,108,124,99,120,99,109' onclick='clickColor("#FFFFCC",-95,99)'
					onmouseover='mouseOverColor("#FFFFCC")' alt='#FFFFCC' /><area style='cursor:pointer' shape='poly'
					coords='126,105,135,109,135,120,126,124,117,120,117,109' onclick='clickColor("#FFCCCC",-95,117)'
					onmouseover='mouseOverColor("#FFCCCC")' alt='#FFCCCC' /><area style='cursor:pointer' shape='poly'
					coords='144,105,153,109,153,120,144,124,135,120,135,109' onclick='clickColor("#FF99CC",-95,135)'
					onmouseover='mouseOverColor("#FF99CC")' alt='#FF99CC' /><area style='cursor:pointer' shape='poly'
					coords='162,105,171,109,171,120,162,124,153,120,153,109' onclick='clickColor("#FF66CC",-95,153)'
					onmouseover='mouseOverColor("#FF66CC")' alt='#FF66CC' /><area style='cursor:pointer' shape='poly'
					coords='180,105,189,109,189,120,180,124,171,120,171,109' onclick='clickColor("#FF33CC",-95,171)'
					onmouseover='mouseOverColor("#FF33CC")' alt='#FF33CC' /><area style='cursor:pointer' shape='poly'
					coords='198,105,207,109,207,120,198,124,189,120,189,109' onclick='clickColor("#CC0099",-95,189)'
					onmouseover='mouseOverColor("#CC0099")' alt='#CC0099' /><area style='cursor:pointer' shape='poly'
					coords='216,105,225,109,225,120,216,124,207,120,207,109' onclick='clickColor("#993399",-95,207)'
					onmouseover='mouseOverColor("#993399")' alt='#993399' /><area style='cursor:pointer' shape='poly'
					coords='27,120,36,124,36,135,27,139,18,135,18,124' onclick='clickColor("#333300",-80,18)'
					onmouseover='mouseOverColor("#333300")' alt='#333300' /><area style='cursor:pointer' shape='poly'
					coords='45,120,54,124,54,135,45,139,36,135,36,124' onclick='clickColor("#669900",-80,36)'
					onmouseover='mouseOverColor("#669900")' alt='#669900' /><area style='cursor:pointer' shape='poly'
					coords='63,120,72,124,72,135,63,139,54,135,54,124' onclick='clickColor("#99FF33",-80,54)'
					onmouseover='mouseOverColor("#99FF33")' alt='#99FF33' /><area style='cursor:pointer' shape='poly'
					coords='81,120,90,124,90,135,81,139,72,135,72,124' onclick='clickColor("#CCFF66",-80,72)'
					onmouseover='mouseOverColor("#CCFF66")' alt='#CCFF66' /><area style='cursor:pointer' shape='poly'
					coords='99,120,108,124,108,135,99,139,90,135,90,124' onclick='clickColor("#FFFF99",-80,90)'
					onmouseover='mouseOverColor("#FFFF99")' alt='#FFFF99' /><area style='cursor:pointer' shape='poly'
					coords='117,120,126,124,126,135,117,139,108,135,108,124' onclick='clickColor("#FFCC99",-80,108)'
					onmouseover='mouseOverColor("#FFCC99")' alt='#FFCC99' /><area style='cursor:pointer' shape='poly'
					coords='135,120,144,124,144,135,135,139,126,135,126,124' onclick='clickColor("#FF9999",-80,126)'
					onmouseover='mouseOverColor("#FF9999")' alt='#FF9999' /><area style='cursor:pointer' shape='poly'
					coords='153,120,162,124,162,135,153,139,144,135,144,124' onclick='clickColor("#FF6699",-80,144)'
					onmouseover='mouseOverColor("#FF6699")' alt='#FF6699' /><area style='cursor:pointer' shape='poly'
					coords='171,120,180,124,180,135,171,139,162,135,162,124' onclick='clickColor("#FF3399",-80,162)'
					onmouseover='mouseOverColor("#FF3399")' alt='#FF3399' /><area style='cursor:pointer' shape='poly'
					coords='189,120,198,124,198,135,189,139,180,135,180,124' onclick='clickColor("#CC3399",-80,180)'
					onmouseover='mouseOverColor("#CC3399")' alt='#CC3399' /><area style='cursor:pointer' shape='poly'
					coords='207,120,216,124,216,135,207,139,198,135,198,124' onclick='clickColor("#990099",-80,198)'
					onmouseover='mouseOverColor("#990099")' alt='#990099' /><area style='cursor:pointer' shape='poly'
					coords='36,135,45,139,45,150,36,154,27,150,27,139' onclick='clickColor("#666633",-65,27)'
					onmouseover='mouseOverColor("#666633")' alt='#666633' /><area style='cursor:pointer' shape='poly'
					coords='54,135,63,139,63,150,54,154,45,150,45,139' onclick='clickColor("#99CC00",-65,45)'
					onmouseover='mouseOverColor("#99CC00")' alt='#99CC00' /><area style='cursor:pointer' shape='poly'
					coords='72,135,81,139,81,150,72,154,63,150,63,139' onclick='clickColor("#CCFF33",-65,63)'
					onmouseover='mouseOverColor("#CCFF33")' alt='#CCFF33' /><area style='cursor:pointer' shape='poly'
					coords='90,135,99,139,99,150,90,154,81,150,81,139' onclick='clickColor("#FFFF66",-65,81)'
					onmouseover='mouseOverColor("#FFFF66")' alt='#FFFF66' /><area style='cursor:pointer' shape='poly'
					coords='108,135,117,139,117,150,108,154,99,150,99,139' onclick='clickColor("#FFCC66",-65,99)'
					onmouseover='mouseOverColor("#FFCC66")' alt='#FFCC66' /><area style='cursor:pointer' shape='poly'
					coords='126,135,135,139,135,150,126,154,117,150,117,139' onclick='clickColor("#FF9966",-65,117)'
					onmouseover='mouseOverColor("#FF9966")' alt='#FF9966' /><area style='cursor:pointer' shape='poly'
					coords='144,135,153,139,153,150,144,154,135,150,135,139' onclick='clickColor("#FF6666",-65,135)'
					onmouseover='mouseOverColor("#FF6666")' alt='#FF6666' /><area style='cursor:pointer' shape='poly'
					coords='162,135,171,139,171,150,162,154,153,150,153,139' onclick='clickColor("#FF0066",-65,153)'
					onmouseover='mouseOverColor("#FF0066")' alt='#FF0066' /><area style='cursor:pointer' shape='poly'
					coords='180,135,189,139,189,150,180,154,171,150,171,139' onclick='clickColor("#CC6699",-65,171)'
					onmouseover='mouseOverColor("#CC6699")' alt='#CC6699' /><area style='cursor:pointer' shape='poly'
					coords='198,135,207,139,207,150,198,154,189,150,189,139' onclick='clickColor("#993366",-65,189)'
					onmouseover='mouseOverColor("#993366")' alt='#993366' /><area style='cursor:pointer' shape='poly'
					coords='45,150,54,154,54,165,45,169,36,165,36,154' onclick='clickColor("#999966",-50,36)'
					onmouseover='mouseOverColor("#999966")' alt='#999966' /><area style='cursor:pointer' shape='poly'
					coords='63,150,72,154,72,165,63,169,54,165,54,154' onclick='clickColor("#CCCC00",-50,54)'
					onmouseover='mouseOverColor("#CCCC00")' alt='#CCCC00' /><area style='cursor:pointer' shape='poly'
					coords='81,150,90,154,90,165,81,169,72,165,72,154' onclick='clickColor("#FFFF00",-50,72)'
					onmouseover='mouseOverColor("#FFFF00")' alt='#FFFF00' /><area style='cursor:pointer' shape='poly'
					coords='99,150,108,154,108,165,99,169,90,165,90,154' onclick='clickColor("#FFCC00",-50,90)'
					onmouseover='mouseOverColor("#FFCC00")' alt='#FFCC00' /><area style='cursor:pointer' shape='poly'
					coords='117,150,126,154,126,165,117,169,108,165,108,154' onclick='clickColor("#FF9933",-50,108)'
					onmouseover='mouseOverColor("#FF9933")' alt='#FF9933' /><area style='cursor:pointer' shape='poly'
					coords='135,150,144,154,144,165,135,169,126,165,126,154' onclick='clickColor("#FF6600",-50,126)'
					onmouseover='mouseOverColor("#FF6600")' alt='#FF6600' /><area style='cursor:pointer' shape='poly'
					coords='153,150,162,154,162,165,153,169,144,165,144,154' onclick='clickColor("#FF5050",-50,144)'
					onmouseover='mouseOverColor("#FF5050")' alt='#FF5050' /><area style='cursor:pointer' shape='poly'
					coords='171,150,180,154,180,165,171,169,162,165,162,154' onclick='clickColor("#CC0066",-50,162)'
					onmouseover='mouseOverColor("#CC0066")' alt='#CC0066' /><area style='cursor:pointer' shape='poly'
					coords='189,150,198,154,198,165,189,169,180,165,180,154' onclick='clickColor("#660033",-50,180)'
					onmouseover='mouseOverColor("#660033")' alt='#660033' /><area style='cursor:pointer' shape='poly'
					coords='54,165,63,169,63,180,54,184,45,180,45,169' onclick='clickColor("#996633",-35,45)'
					onmouseover='mouseOverColor("#996633")' alt='#996633' /><area style='cursor:pointer' shape='poly'
					coords='72,165,81,169,81,180,72,184,63,180,63,169' onclick='clickColor("#CC9900",-35,63)'
					onmouseover='mouseOverColor("#CC9900")' alt='#CC9900' /><area style='cursor:pointer' shape='poly'
					coords='90,165,99,169,99,180,90,184,81,180,81,169' onclick='clickColor("#FF9900",-35,81)'
					onmouseover='mouseOverColor("#FF9900")' alt='#FF9900' /><area style='cursor:pointer' shape='poly'
					coords='108,165,117,169,117,180,108,184,99,180,99,169' onclick='clickColor("#CC6600",-35,99)'
					onmouseover='mouseOverColor("#CC6600")' alt='#CC6600' /><area style='cursor:pointer' shape='poly'
					coords='126,165,135,169,135,180,126,184,117,180,117,169' onclick='clickColor("#FF3300",-35,117)'
					onmouseover='mouseOverColor("#FF3300")' alt='#FF3300' /><area style='cursor:pointer' shape='poly'
					coords='144,165,153,169,153,180,144,184,135,180,135,169' onclick='clickColor("#FF0000",-35,135)'
					onmouseover='mouseOverColor("#FF0000")' alt='#FF0000' /><area style='cursor:pointer' shape='poly'
					coords='162,165,171,169,171,180,162,184,153,180,153,169' onclick='clickColor("#CC0000",-35,153)'
					onmouseover='mouseOverColor("#CC0000")' alt='#CC0000' /><area style='cursor:pointer' shape='poly'
					coords='180,165,189,169,189,180,180,184,171,180,171,169' onclick='clickColor("#990033",-35,171)'
					onmouseover='mouseOverColor("#990033")' alt='#990033' /><area style='cursor:pointer' shape='poly'
					coords='63,180,72,184,72,195,63,199,54,195,54,184' onclick='clickColor("#663300",-20,54)'
					onmouseover='mouseOverColor("#663300")' alt='#663300' /><area style='cursor:pointer' shape='poly'
					coords='81,180,90,184,90,195,81,199,72,195,72,184' onclick='clickColor("#996600",-20,72)'
					onmouseover='mouseOverColor("#996600")' alt='#996600' /><area style='cursor:pointer' shape='poly'
					coords='99,180,108,184,108,195,99,199,90,195,90,184' onclick='clickColor("#CC3300",-20,90)'
					onmouseover='mouseOverColor("#CC3300")' alt='#CC3300' /><area style='cursor:pointer' shape='poly'
					coords='117,180,126,184,126,195,117,199,108,195,108,184' onclick='clickColor("#993300",-20,108)'
					onmouseover='mouseOverColor("#993300")' alt='#993300' /><area style='cursor:pointer' shape='poly'
					coords='135,180,144,184,144,195,135,199,126,195,126,184' onclick='clickColor("#990000",-20,126)'
					onmouseover='mouseOverColor("#990000")' alt='#990000' /><area style='cursor:pointer' shape='poly'
					coords='153,180,162,184,162,195,153,199,144,195,144,184' onclick='clickColor("#800000",-20,144)'
					onmouseover='mouseOverColor("#800000")' alt='#800000' /><area style='cursor:pointer' shape='poly'
					coords='171,180,180,184,180,195,171,199,162,195,162,184' onclick='clickColor("#993333",-20,162)'
					onmouseover='mouseOverColor("#993333")' alt='#993333' />
					</map>


		`;
	return mCreateFrom(html);
}
//#region inside of part111
function map111() {
	return `
	<map
	id='colormap' name='colormap' onmouseout='mouseOutMap()'><area style='cursor:pointer' shape='poly'
		coords='63,0,72,4,72,15,63,19,54,15,54,4' onclick='clickColor("#003366",-200,54)'
		onmouseover='mouseOverColor("#003366")' alt='#003366' /><area style='cursor:pointer' shape='poly'
		coords='81,0,90,4,90,15,81,19,72,15,72,4' onclick='clickColor("#336699",-200,72)'
		onmouseover='mouseOverColor("#336699")' alt='#336699' /><area style='cursor:pointer' shape='poly'
		coords='99,0,108,4,108,15,99,19,90,15,90,4' onclick='clickColor("#3366CC",-200,90)'
		onmouseover='mouseOverColor("#3366CC")' alt='#3366CC' /><area style='cursor:pointer' shape='poly'
		coords='117,0,126,4,126,15,117,19,108,15,108,4' onclick='clickColor("#003399",-200,108)'
		onmouseover='mouseOverColor("#003399")' alt='#003399' /><area style='cursor:pointer' shape='poly'
		coords='135,0,144,4,144,15,135,19,126,15,126,4' onclick='clickColor("#000099",-200,126)'
		onmouseover='mouseOverColor("#000099")' alt='#000099' /><area style='cursor:pointer' shape='poly'
		coords='153,0,162,4,162,15,153,19,144,15,144,4' onclick='clickColor("#0000CC",-200,144)'
		onmouseover='mouseOverColor("#0000CC")' alt='#0000CC' /><area style='cursor:pointer' shape='poly'
		coords='171,0,180,4,180,15,171,19,162,15,162,4' onclick='clickColor("#000066",-200,162)'
		onmouseover='mouseOverColor("#000066")' alt='#000066' /><area style='cursor:pointer' shape='poly'
		coords='54,15,63,19,63,30,54,34,45,30,45,19' onclick='clickColor("#006666",-185,45)'
		onmouseover='mouseOverColor("#006666")' alt='#006666' /><area style='cursor:pointer' shape='poly'
		coords='72,15,81,19,81,30,72,34,63,30,63,19' onclick='clickColor("#006699",-185,63)'
		onmouseover='mouseOverColor("#006699")' alt='#006699' /><area style='cursor:pointer' shape='poly'
		coords='90,15,99,19,99,30,90,34,81,30,81,19' onclick='clickColor("#0099CC",-185,81)'
		onmouseover='mouseOverColor("#0099CC")' alt='#0099CC' /><area style='cursor:pointer' shape='poly'
		coords='108,15,117,19,117,30,108,34,99,30,99,19' onclick='clickColor("#0066CC",-185,99)'
		onmouseover='mouseOverColor("#0066CC")' alt='#0066CC' /><area style='cursor:pointer' shape='poly'
		coords='126,15,135,19,135,30,126,34,117,30,117,19' onclick='clickColor("#0033CC",-185,117)'
		onmouseover='mouseOverColor("#0033CC")' alt='#0033CC' /><area style='cursor:pointer' shape='poly'
		coords='144,15,153,19,153,30,144,34,135,30,135,19' onclick='clickColor("#0000FF",-185,135)'
		onmouseover='mouseOverColor("#0000FF")' alt='#0000FF' /><area style='cursor:pointer' shape='poly'
		coords='162,15,171,19,171,30,162,34,153,30,153,19' onclick='clickColor("#3333FF",-185,153)'
		onmouseover='mouseOverColor("#3333FF")' alt='#3333FF' /><area style='cursor:pointer' shape='poly'
		coords='180,15,189,19,189,30,180,34,171,30,171,19' onclick='clickColor("#333399",-185,171)'
		onmouseover='mouseOverColor("#333399")' alt='#333399' /><area style='cursor:pointer' shape='poly'
		coords='45,30,54,34,54,45,45,49,36,45,36,34' onclick='clickColor("#669999",-170,36)'
		onmouseover='mouseOverColor("#669999")' alt='#669999' /><area style='cursor:pointer' shape='poly'
		coords='63,30,72,34,72,45,63,49,54,45,54,34' onclick='clickColor("#009999",-170,54)'
		onmouseover='mouseOverColor("#009999")' alt='#009999' /><area style='cursor:pointer' shape='poly'
		coords='81,30,90,34,90,45,81,49,72,45,72,34' onclick='clickColor("#33CCCC",-170,72)'
		onmouseover='mouseOverColor("#33CCCC")' alt='#33CCCC' /><area style='cursor:pointer' shape='poly'
		coords='99,30,108,34,108,45,99,49,90,45,90,34' onclick='clickColor("#00CCFF",-170,90)'
		onmouseover='mouseOverColor("#00CCFF")' alt='#00CCFF' /><area style='cursor:pointer' shape='poly'
		coords='117,30,126,34,126,45,117,49,108,45,108,34' onclick='clickColor("#0099FF",-170,108)'
		onmouseover='mouseOverColor("#0099FF")' alt='#0099FF' /><area style='cursor:pointer' shape='poly'
		coords='135,30,144,34,144,45,135,49,126,45,126,34' onclick='clickColor("#0066FF",-170,126)'
		onmouseover='mouseOverColor("#0066FF")' alt='#0066FF' /><area style='cursor:pointer' shape='poly'
		coords='153,30,162,34,162,45,153,49,144,45,144,34' onclick='clickColor("#3366FF",-170,144)'
		onmouseover='mouseOverColor("#3366FF")' alt='#3366FF' /><area style='cursor:pointer' shape='poly'
		coords='171,30,180,34,180,45,171,49,162,45,162,34' onclick='clickColor("#3333CC",-170,162)'
		onmouseover='mouseOverColor("#3333CC")' alt='#3333CC' /><area style='cursor:pointer' shape='poly'
		coords='189,30,198,34,198,45,189,49,180,45,180,34' onclick='clickColor("#666699",-170,180)'
		onmouseover='mouseOverColor("#666699")' alt='#666699' /><area style='cursor:pointer' shape='poly'
		coords='36,45,45,49,45,60,36,64,27,60,27,49' onclick='clickColor("#339966",-155,27)'
		onmouseover='mouseOverColor("#339966")' alt='#339966' /><area style='cursor:pointer' shape='poly'
		coords='54,45,63,49,63,60,54,64,45,60,45,49' onclick='clickColor("#00CC99",-155,45)'
		onmouseover='mouseOverColor("#00CC99")' alt='#00CC99' /><area style='cursor:pointer' shape='poly'
		coords='72,45,81,49,81,60,72,64,63,60,63,49' onclick='clickColor("#00FFCC",-155,63)'
		onmouseover='mouseOverColor("#00FFCC")' alt='#00FFCC' /><area style='cursor:pointer' shape='poly'
		coords='90,45,99,49,99,60,90,64,81,60,81,49' onclick='clickColor("#00FFFF",-155,81)'
		onmouseover='mouseOverColor("#00FFFF")' alt='#00FFFF' /><area style='cursor:pointer' shape='poly'
		coords='108,45,117,49,117,60,108,64,99,60,99,49' onclick='clickColor("#33CCFF",-155,99)'
		onmouseover='mouseOverColor("#33CCFF")' alt='#33CCFF' /><area style='cursor:pointer' shape='poly'
		coords='126,45,135,49,135,60,126,64,117,60,117,49' onclick='clickColor("#3399FF",-155,117)'
		onmouseover='mouseOverColor("#3399FF")' alt='#3399FF' /><area style='cursor:pointer' shape='poly'
		coords='144,45,153,49,153,60,144,64,135,60,135,49' onclick='clickColor("#6699FF",-155,135)'
		onmouseover='mouseOverColor("#6699FF")' alt='#6699FF' /><area style='cursor:pointer' shape='poly'
		coords='162,45,171,49,171,60,162,64,153,60,153,49' onclick='clickColor("#6666FF",-155,153)'
		onmouseover='mouseOverColor("#6666FF")' alt='#6666FF' /><area style='cursor:pointer' shape='poly'
		coords='180,45,189,49,189,60,180,64,171,60,171,49' onclick='clickColor("#6600FF",-155,171)'
		onmouseover='mouseOverColor("#6600FF")' alt='#6600FF' /><area style='cursor:pointer' shape='poly'
		coords='198,45,207,49,207,60,198,64,189,60,189,49' onclick='clickColor("#6600CC",-155,189)'
		onmouseover='mouseOverColor("#6600CC")' alt='#6600CC' /><area style='cursor:pointer' shape='poly'
		coords='27,60,36,64,36,75,27,79,18,75,18,64' onclick='clickColor("#339933",-140,18)'
		onmouseover='mouseOverColor("#339933")' alt='#339933' /><area style='cursor:pointer' shape='poly'
		coords='45,60,54,64,54,75,45,79,36,75,36,64' onclick='clickColor("#00CC66",-140,36)'
		onmouseover='mouseOverColor("#00CC66")' alt='#00CC66' /><area style='cursor:pointer' shape='poly'
		coords='63,60,72,64,72,75,63,79,54,75,54,64' onclick='clickColor("#00FF99",-140,54)'
		onmouseover='mouseOverColor("#00FF99")' alt='#00FF99' /><area style='cursor:pointer' shape='poly'
		coords='81,60,90,64,90,75,81,79,72,75,72,64' onclick='clickColor("#66FFCC",-140,72)'
		onmouseover='mouseOverColor("#66FFCC")' alt='#66FFCC' /><area style='cursor:pointer' shape='poly'
		coords='99,60,108,64,108,75,99,79,90,75,90,64' onclick='clickColor("#66FFFF",-140,90)'
		onmouseover='mouseOverColor("#66FFFF")' alt='#66FFFF' /><area style='cursor:pointer' shape='poly'
		coords='117,60,126,64,126,75,117,79,108,75,108,64' onclick='clickColor("#66CCFF",-140,108)'
		onmouseover='mouseOverColor("#66CCFF")' alt='#66CCFF' /><area style='cursor:pointer' shape='poly'
		coords='135,60,144,64,144,75,135,79,126,75,126,64' onclick='clickColor("#99CCFF",-140,126)'
		onmouseover='mouseOverColor("#99CCFF")' alt='#99CCFF' /><area style='cursor:pointer' shape='poly'
		coords='153,60,162,64,162,75,153,79,144,75,144,64' onclick='clickColor("#9999FF",-140,144)'
		onmouseover='mouseOverColor("#9999FF")' alt='#9999FF' /><area style='cursor:pointer' shape='poly'
		coords='171,60,180,64,180,75,171,79,162,75,162,64' onclick='clickColor("#9966FF",-140,162)'
		onmouseover='mouseOverColor("#9966FF")' alt='#9966FF' /><area style='cursor:pointer' shape='poly'
		coords='189,60,198,64,198,75,189,79,180,75,180,64' onclick='clickColor("#9933FF",-140,180)'
		onmouseover='mouseOverColor("#9933FF")' alt='#9933FF' /><area style='cursor:pointer' shape='poly'
		coords='207,60,216,64,216,75,207,79,198,75,198,64' onclick='clickColor("#9900FF",-140,198)'
		onmouseover='mouseOverColor("#9900FF")' alt='#9900FF' /><area style='cursor:pointer' shape='poly'
		coords='18,75,27,79,27,90,18,94,9,90,9,79' onclick='clickColor("#006600",-125,9)'
		onmouseover='mouseOverColor("#006600")' alt='#006600' /><area style='cursor:pointer' shape='poly'
		coords='36,75,45,79,45,90,36,94,27,90,27,79' onclick='clickColor("#00CC00",-125,27)'
		onmouseover='mouseOverColor("#00CC00")' alt='#00CC00' /><area style='cursor:pointer' shape='poly'
		coords='54,75,63,79,63,90,54,94,45,90,45,79' onclick='clickColor("#00FF00",-125,45)'
		onmouseover='mouseOverColor("#00FF00")' alt='#00FF00' /><area style='cursor:pointer' shape='poly'
		coords='72,75,81,79,81,90,72,94,63,90,63,79' onclick='clickColor("#66FF99",-125,63)'
		onmouseover='mouseOverColor("#66FF99")' alt='#66FF99' /><area style='cursor:pointer' shape='poly'
		coords='90,75,99,79,99,90,90,94,81,90,81,79' onclick='clickColor("#99FFCC",-125,81)'
		onmouseover='mouseOverColor("#99FFCC")' alt='#99FFCC' /><area style='cursor:pointer' shape='poly'
		coords='108,75,117,79,117,90,108,94,99,90,99,79' onclick='clickColor("#CCFFFF",-125,99)'
		onmouseover='mouseOverColor("#CCFFFF")' alt='#CCFFFF' /><area style='cursor:pointer' shape='poly'
		coords='126,75,135,79,135,90,126,94,117,90,117,79' onclick='clickColor("#CCCCFF",-125,117)'
		onmouseover='mouseOverColor("#CCCCFF")' alt='#CCCCFF' /><area style='cursor:pointer' shape='poly'
		coords='144,75,153,79,153,90,144,94,135,90,135,79' onclick='clickColor("#CC99FF",-125,135)'
		onmouseover='mouseOverColor("#CC99FF")' alt='#CC99FF' /><area style='cursor:pointer' shape='poly'
		coords='162,75,171,79,171,90,162,94,153,90,153,79' onclick='clickColor("#CC66FF",-125,153)'
		onmouseover='mouseOverColor("#CC66FF")' alt='#CC66FF' /><area style='cursor:pointer' shape='poly'
		coords='180,75,189,79,189,90,180,94,171,90,171,79' onclick='clickColor("#CC33FF",-125,171)'
		onmouseover='mouseOverColor("#CC33FF")' alt='#CC33FF' /><area style='cursor:pointer' shape='poly'
		coords='198,75,207,79,207,90,198,94,189,90,189,79' onclick='clickColor("#CC00FF",-125,189)'
		onmouseover='mouseOverColor("#CC00FF")' alt='#CC00FF' /><area style='cursor:pointer' shape='poly'
		coords='216,75,225,79,225,90,216,94,207,90,207,79' onclick='clickColor("#9900CC",-125,207)'
		onmouseover='mouseOverColor("#9900CC")' alt='#9900CC' /><area style='cursor:pointer' shape='poly'
		coords='9,90,18,94,18,105,9,109,0,105,0,94' onclick='clickColor("#003300",-110,0)'
		onmouseover='mouseOverColor("#003300")' alt='#003300' /><area style='cursor:pointer' shape='poly'
		coords='27,90,36,94,36,105,27,109,18,105,18,94' onclick='clickColor("#009933",-110,18)'
		onmouseover='mouseOverColor("#009933")' alt='#009933' /><area style='cursor:pointer' shape='poly'
		coords='45,90,54,94,54,105,45,109,36,105,36,94' onclick='clickColor("#33CC33",-110,36)'
		onmouseover='mouseOverColor("#33CC33")' alt='#33CC33' /><area style='cursor:pointer' shape='poly'
		coords='63,90,72,94,72,105,63,109,54,105,54,94' onclick='clickColor("#66FF66",-110,54)'
		onmouseover='mouseOverColor("#66FF66")' alt='#66FF66' /><area style='cursor:pointer' shape='poly'
		coords='81,90,90,94,90,105,81,109,72,105,72,94' onclick='clickColor("#99FF99",-110,72)'
		onmouseover='mouseOverColor("#99FF99")' alt='#99FF99' /><area style='cursor:pointer' shape='poly'
		coords='99,90,108,94,108,105,99,109,90,105,90,94' onclick='clickColor("#CCFFCC",-110,90)'
		onmouseover='mouseOverColor("#CCFFCC")' alt='#CCFFCC' /><area style='cursor:pointer' shape='poly'
		coords='117,90,126,94,126,105,117,109,108,105,108,94' onclick='clickColor("#FFFFFF",-110,108)'
		onmouseover='mouseOverColor("#FFFFFF")' alt='#FFFFFF' /><area style='cursor:pointer' shape='poly'
		coords='135,90,144,94,144,105,135,109,126,105,126,94' onclick='clickColor("#FFCCFF",-110,126)'
		onmouseover='mouseOverColor("#FFCCFF")' alt='#FFCCFF' /><area style='cursor:pointer' shape='poly'
		coords='153,90,162,94,162,105,153,109,144,105,144,94' onclick='clickColor("#FF99FF",-110,144)'
		onmouseover='mouseOverColor("#FF99FF")' alt='#FF99FF' /><area style='cursor:pointer' shape='poly'
		coords='171,90,180,94,180,105,171,109,162,105,162,94' onclick='clickColor("#FF66FF",-110,162)'
		onmouseover='mouseOverColor("#FF66FF")' alt='#FF66FF' /><area style='cursor:pointer' shape='poly'
		coords='189,90,198,94,198,105,189,109,180,105,180,94' onclick='clickColor("#FF00FF",-110,180)'
		onmouseover='mouseOverColor("#FF00FF")' alt='#FF00FF' /><area style='cursor:pointer' shape='poly'
		coords='207,90,216,94,216,105,207,109,198,105,198,94' onclick='clickColor("#CC00CC",-110,198)'
		onmouseover='mouseOverColor("#CC00CC")' alt='#CC00CC' /><area style='cursor:pointer' shape='poly'
		coords='225,90,234,94,234,105,225,109,216,105,216,94' onclick='clickColor("#660066",-110,216)'
		onmouseover='mouseOverColor("#660066")' alt='#660066' /><area style='cursor:pointer' shape='poly'
		coords='18,105,27,109,27,120,18,124,9,120,9,109' onclick='clickColor("#336600",-95,9)'
		onmouseover='mouseOverColor("#336600")' alt='#336600' /><area style='cursor:pointer' shape='poly'
		coords='36,105,45,109,45,120,36,124,27,120,27,109' onclick='clickColor("#009900",-95,27)'
		onmouseover='mouseOverColor("#009900")' alt='#009900' /><area style='cursor:pointer' shape='poly'
		coords='54,105,63,109,63,120,54,124,45,120,45,109' onclick='clickColor("#66FF33",-95,45)'
		onmouseover='mouseOverColor("#66FF33")' alt='#66FF33' /><area style='cursor:pointer' shape='poly'
		coords='72,105,81,109,81,120,72,124,63,120,63,109' onclick='clickColor("#99FF66",-95,63)'
		onmouseover='mouseOverColor("#99FF66")' alt='#99FF66' /><area style='cursor:pointer' shape='poly'
		coords='90,105,99,109,99,120,90,124,81,120,81,109' onclick='clickColor("#CCFF99",-95,81)'
		onmouseover='mouseOverColor("#CCFF99")' alt='#CCFF99' /><area style='cursor:pointer' shape='poly'
		coords='108,105,117,109,117,120,108,124,99,120,99,109' onclick='clickColor("#FFFFCC",-95,99)'
		onmouseover='mouseOverColor("#FFFFCC")' alt='#FFFFCC' /><area style='cursor:pointer' shape='poly'
		coords='126,105,135,109,135,120,126,124,117,120,117,109' onclick='clickColor("#FFCCCC",-95,117)'
		onmouseover='mouseOverColor("#FFCCCC")' alt='#FFCCCC' /><area style='cursor:pointer' shape='poly'
		coords='144,105,153,109,153,120,144,124,135,120,135,109' onclick='clickColor("#FF99CC",-95,135)'
		onmouseover='mouseOverColor("#FF99CC")' alt='#FF99CC' /><area style='cursor:pointer' shape='poly'
		coords='162,105,171,109,171,120,162,124,153,120,153,109' onclick='clickColor("#FF66CC",-95,153)'
		onmouseover='mouseOverColor("#FF66CC")' alt='#FF66CC' /><area style='cursor:pointer' shape='poly'
		coords='180,105,189,109,189,120,180,124,171,120,171,109' onclick='clickColor("#FF33CC",-95,171)'
		onmouseover='mouseOverColor("#FF33CC")' alt='#FF33CC' /><area style='cursor:pointer' shape='poly'
		coords='198,105,207,109,207,120,198,124,189,120,189,109' onclick='clickColor("#CC0099",-95,189)'
		onmouseover='mouseOverColor("#CC0099")' alt='#CC0099' /><area style='cursor:pointer' shape='poly'
		coords='216,105,225,109,225,120,216,124,207,120,207,109' onclick='clickColor("#993399",-95,207)'
		onmouseover='mouseOverColor("#993399")' alt='#993399' /><area style='cursor:pointer' shape='poly'
		coords='27,120,36,124,36,135,27,139,18,135,18,124' onclick='clickColor("#333300",-80,18)'
		onmouseover='mouseOverColor("#333300")' alt='#333300' /><area style='cursor:pointer' shape='poly'
		coords='45,120,54,124,54,135,45,139,36,135,36,124' onclick='clickColor("#669900",-80,36)'
		onmouseover='mouseOverColor("#669900")' alt='#669900' /><area style='cursor:pointer' shape='poly'
		coords='63,120,72,124,72,135,63,139,54,135,54,124' onclick='clickColor("#99FF33",-80,54)'
		onmouseover='mouseOverColor("#99FF33")' alt='#99FF33' /><area style='cursor:pointer' shape='poly'
		coords='81,120,90,124,90,135,81,139,72,135,72,124' onclick='clickColor("#CCFF66",-80,72)'
		onmouseover='mouseOverColor("#CCFF66")' alt='#CCFF66' /><area style='cursor:pointer' shape='poly'
		coords='99,120,108,124,108,135,99,139,90,135,90,124' onclick='clickColor("#FFFF99",-80,90)'
		onmouseover='mouseOverColor("#FFFF99")' alt='#FFFF99' /><area style='cursor:pointer' shape='poly'
		coords='117,120,126,124,126,135,117,139,108,135,108,124' onclick='clickColor("#FFCC99",-80,108)'
		onmouseover='mouseOverColor("#FFCC99")' alt='#FFCC99' /><area style='cursor:pointer' shape='poly'
		coords='135,120,144,124,144,135,135,139,126,135,126,124' onclick='clickColor("#FF9999",-80,126)'
		onmouseover='mouseOverColor("#FF9999")' alt='#FF9999' /><area style='cursor:pointer' shape='poly'
		coords='153,120,162,124,162,135,153,139,144,135,144,124' onclick='clickColor("#FF6699",-80,144)'
		onmouseover='mouseOverColor("#FF6699")' alt='#FF6699' /><area style='cursor:pointer' shape='poly'
		coords='171,120,180,124,180,135,171,139,162,135,162,124' onclick='clickColor("#FF3399",-80,162)'
		onmouseover='mouseOverColor("#FF3399")' alt='#FF3399' /><area style='cursor:pointer' shape='poly'
		coords='189,120,198,124,198,135,189,139,180,135,180,124' onclick='clickColor("#CC3399",-80,180)'
		onmouseover='mouseOverColor("#CC3399")' alt='#CC3399' /><area style='cursor:pointer' shape='poly'
		coords='207,120,216,124,216,135,207,139,198,135,198,124' onclick='clickColor("#990099",-80,198)'
		onmouseover='mouseOverColor("#990099")' alt='#990099' /><area style='cursor:pointer' shape='poly'
		coords='36,135,45,139,45,150,36,154,27,150,27,139' onclick='clickColor("#666633",-65,27)'
		onmouseover='mouseOverColor("#666633")' alt='#666633' /><area style='cursor:pointer' shape='poly'
		coords='54,135,63,139,63,150,54,154,45,150,45,139' onclick='clickColor("#99CC00",-65,45)'
		onmouseover='mouseOverColor("#99CC00")' alt='#99CC00' /><area style='cursor:pointer' shape='poly'
		coords='72,135,81,139,81,150,72,154,63,150,63,139' onclick='clickColor("#CCFF33",-65,63)'
		onmouseover='mouseOverColor("#CCFF33")' alt='#CCFF33' /><area style='cursor:pointer' shape='poly'
		coords='90,135,99,139,99,150,90,154,81,150,81,139' onclick='clickColor("#FFFF66",-65,81)'
		onmouseover='mouseOverColor("#FFFF66")' alt='#FFFF66' /><area style='cursor:pointer' shape='poly'
		coords='108,135,117,139,117,150,108,154,99,150,99,139' onclick='clickColor("#FFCC66",-65,99)'
		onmouseover='mouseOverColor("#FFCC66")' alt='#FFCC66' /><area style='cursor:pointer' shape='poly'
		coords='126,135,135,139,135,150,126,154,117,150,117,139' onclick='clickColor("#FF9966",-65,117)'
		onmouseover='mouseOverColor("#FF9966")' alt='#FF9966' /><area style='cursor:pointer' shape='poly'
		coords='144,135,153,139,153,150,144,154,135,150,135,139' onclick='clickColor("#FF6666",-65,135)'
		onmouseover='mouseOverColor("#FF6666")' alt='#FF6666' /><area style='cursor:pointer' shape='poly'
		coords='162,135,171,139,171,150,162,154,153,150,153,139' onclick='clickColor("#FF0066",-65,153)'
		onmouseover='mouseOverColor("#FF0066")' alt='#FF0066' /><area style='cursor:pointer' shape='poly'
		coords='180,135,189,139,189,150,180,154,171,150,171,139' onclick='clickColor("#CC6699",-65,171)'
		onmouseover='mouseOverColor("#CC6699")' alt='#CC6699' /><area style='cursor:pointer' shape='poly'
		coords='198,135,207,139,207,150,198,154,189,150,189,139' onclick='clickColor("#993366",-65,189)'
		onmouseover='mouseOverColor("#993366")' alt='#993366' /><area style='cursor:pointer' shape='poly'
		coords='45,150,54,154,54,165,45,169,36,165,36,154' onclick='clickColor("#999966",-50,36)'
		onmouseover='mouseOverColor("#999966")' alt='#999966' /><area style='cursor:pointer' shape='poly'
		coords='63,150,72,154,72,165,63,169,54,165,54,154' onclick='clickColor("#CCCC00",-50,54)'
		onmouseover='mouseOverColor("#CCCC00")' alt='#CCCC00' /><area style='cursor:pointer' shape='poly'
		coords='81,150,90,154,90,165,81,169,72,165,72,154' onclick='clickColor("#FFFF00",-50,72)'
		onmouseover='mouseOverColor("#FFFF00")' alt='#FFFF00' /><area style='cursor:pointer' shape='poly'
		coords='99,150,108,154,108,165,99,169,90,165,90,154' onclick='clickColor("#FFCC00",-50,90)'
		onmouseover='mouseOverColor("#FFCC00")' alt='#FFCC00' /><area style='cursor:pointer' shape='poly'
		coords='117,150,126,154,126,165,117,169,108,165,108,154' onclick='clickColor("#FF9933",-50,108)'
		onmouseover='mouseOverColor("#FF9933")' alt='#FF9933' /><area style='cursor:pointer' shape='poly'
		coords='135,150,144,154,144,165,135,169,126,165,126,154' onclick='clickColor("#FF6600",-50,126)'
		onmouseover='mouseOverColor("#FF6600")' alt='#FF6600' /><area style='cursor:pointer' shape='poly'
		coords='153,150,162,154,162,165,153,169,144,165,144,154' onclick='clickColor("#FF5050",-50,144)'
		onmouseover='mouseOverColor("#FF5050")' alt='#FF5050' /><area style='cursor:pointer' shape='poly'
		coords='171,150,180,154,180,165,171,169,162,165,162,154' onclick='clickColor("#CC0066",-50,162)'
		onmouseover='mouseOverColor("#CC0066")' alt='#CC0066' /><area style='cursor:pointer' shape='poly'
		coords='189,150,198,154,198,165,189,169,180,165,180,154' onclick='clickColor("#660033",-50,180)'
		onmouseover='mouseOverColor("#660033")' alt='#660033' /><area style='cursor:pointer' shape='poly'
		coords='54,165,63,169,63,180,54,184,45,180,45,169' onclick='clickColor("#996633",-35,45)'
		onmouseover='mouseOverColor("#996633")' alt='#996633' /><area style='cursor:pointer' shape='poly'
		coords='72,165,81,169,81,180,72,184,63,180,63,169' onclick='clickColor("#CC9900",-35,63)'
		onmouseover='mouseOverColor("#CC9900")' alt='#CC9900' /><area style='cursor:pointer' shape='poly'
		coords='90,165,99,169,99,180,90,184,81,180,81,169' onclick='clickColor("#FF9900",-35,81)'
		onmouseover='mouseOverColor("#FF9900")' alt='#FF9900' /><area style='cursor:pointer' shape='poly'
		coords='108,165,117,169,117,180,108,184,99,180,99,169' onclick='clickColor("#CC6600",-35,99)'
		onmouseover='mouseOverColor("#CC6600")' alt='#CC6600' /><area style='cursor:pointer' shape='poly'
		coords='126,165,135,169,135,180,126,184,117,180,117,169' onclick='clickColor("#FF3300",-35,117)'
		onmouseover='mouseOverColor("#FF3300")' alt='#FF3300' /><area style='cursor:pointer' shape='poly'
		coords='144,165,153,169,153,180,144,184,135,180,135,169' onclick='clickColor("#FF0000",-35,135)'
		onmouseover='mouseOverColor("#FF0000")' alt='#FF0000' /><area style='cursor:pointer' shape='poly'
		coords='162,165,171,169,171,180,162,184,153,180,153,169' onclick='clickColor("#CC0000",-35,153)'
		onmouseover='mouseOverColor("#CC0000")' alt='#CC0000' /><area style='cursor:pointer' shape='poly'
		coords='180,165,189,169,189,180,180,184,171,180,171,169' onclick='clickColor("#990033",-35,171)'
		onmouseover='mouseOverColor("#990033")' alt='#990033' /><area style='cursor:pointer' shape='poly'
		coords='63,180,72,184,72,195,63,199,54,195,54,184' onclick='clickColor("#663300",-20,54)'
		onmouseover='mouseOverColor("#663300")' alt='#663300' /><area style='cursor:pointer' shape='poly'
		coords='81,180,90,184,90,195,81,199,72,195,72,184' onclick='clickColor("#996600",-20,72)'
		onmouseover='mouseOverColor("#996600")' alt='#996600' /><area style='cursor:pointer' shape='poly'
		coords='99,180,108,184,108,195,99,199,90,195,90,184' onclick='clickColor("#CC3300",-20,90)'
		onmouseover='mouseOverColor("#CC3300")' alt='#CC3300' /><area style='cursor:pointer' shape='poly'
		coords='117,180,126,184,126,195,117,199,108,195,108,184' onclick='clickColor("#993300",-20,108)'
		onmouseover='mouseOverColor("#993300")' alt='#993300' /><area style='cursor:pointer' shape='poly'
		coords='135,180,144,184,144,195,135,199,126,195,126,184' onclick='clickColor("#990000",-20,126)'
		onmouseover='mouseOverColor("#990000")' alt='#990000' /><area style='cursor:pointer' shape='poly'
		coords='153,180,162,184,162,195,153,199,144,195,144,184' onclick='clickColor("#800000",-20,144)'
		onmouseover='mouseOverColor("#800000")' alt='#800000' /><area style='cursor:pointer' shape='poly'
		coords='171,180,180,184,180,195,171,199,162,195,162,184' onclick='clickColor("#993333",-20,162)'
		onmouseover='mouseOverColor("#993333")' alt='#993333' /></map>
	`;
}
function script111() {
	return `
			<script>
			var thistop = "-35";
			var thisleft = "135";
			</script>
		`;
}
function selecthexagon111() {
	return `
		<div id="selectedhexagon"
		style='visibility:hidden;position:relative;width:21px;height:21px;background-image:url("../copi2/img_selectedcolor.gif")'>
		</div>
	`;
}
function previewDiv_111() { return `<div id='divpreview'>&nbsp;</div>`; }
function h3_111(s) { return `<h3>${s}</h3>`; }
function entercolor111() {
	return `
		<div id="entercolorDIV">
		<input type="text" id="entercolor" placeholder="Color value" onkeydown="submitOnEnter(event)" onfocus="clearWrongInput();" style="z-index:0;">
		<button class="btn btn-default" type="button" onclick="clickColor(0,-1,-1)" style="z-index:0;">OK</button>
		</div>
		`;
}
function wrongInput_111() { return `<div id="wronginputDIV">Wrong Input</div>` }
function html5Div_111() {
	return `
		<div id="html5DIV">
			<h3>Or Use HTML5:</h3>
			<input type="color" id="html5colorpicker" onchange="clickColor(0, -1, -1, 5)" value="#ff0000"	style="width:85%;">
		</div>
	`;
}
function part111() {
	let html = `
	<div class="w3-row">
		<div class="w3-col colorthird1" style="text-align:center;">
			<h3>Pick a Color:</h3>
			<div style="margin:auto;width:236px;">
				<img style='margin-right:2px;' src='../copi2/w3/img_colormap.gif' usemap='#colormap' alt='colormap' />
				${map111()}				
				${script111()}				
				<div id='selectedhexagon'
					style='visibility:hidden;position:relative;width:21px;height:21px;background-image:url("../copi2/w3/img_selectedcolor.gif")'>
				</div>
				<div id='divpreview'>&nbsp;</div>
				<h3>Or Enter a Color:</h3>
				<div id="entercolorDIV">
					<input type="text" id="entercolor" placeholder="Color value" onkeydown="submitOnEnter(event)"
						onfocus="clearWrongInput();" style="z-index:0;"><button class="btn btn-default" type="button"
						onclick="clickColor(0,-1,-1)" style="z-index:0;">OK</button>
				</div>
				<div id="wronginputDIV">Wrong Input</div>
				<br>
				<div id="html5DIV">
					<h3>Or Use HTML5:</h3>
					<input type="color" id="html5colorpicker" onchange="clickColor(0, -1, -1, 5)" value="#ff0000"
						style="width:85%;">
				</div>
				<br>
				<br>
			</div>
		</div>
	</div>

	`;

	return mCreateFrom(html);

}
function part111() {
	let html = `
	<div class="w3-row">
		<div class="w3-col colorthird1" style="text-align:center;">
			<h3>Pick a Color:</h3>
			<div style="margin:auto;width:236px;">
				<img style='margin-right:2px;' src='../copi2/w3/img_colormap.gif' usemap='#colormap' alt='colormap' />
				${map111()}				
				${script111()}				
				${selecthexagon111()}				
				${previewDiv_111()}				
				${h3_111('Or Enter a Color')}				
				${entercolor111()}				
				${wrongInput_111()}
				<br>
				${html5Div_111()}
				<br>
				<br>
			</div>
		</div>
	</div>
	`;

	return mCreateFrom(html);

}
function part111() {
	let html = `
	<div class="w3-row">
		<div class="w3-col colorthird1" style="text-align:center;">
			<h3>Pick a Color:</h3>
			<div style="margin:auto;width:236px;">
				<img style='margin-right:2px;' src='../copi2/w3/img_colormap.gif' usemap='#colormap' alt='colormap' />
				${map111()}				
				${script111()}				
				${selecthexagon111()}				
				${previewDiv_111()}				
				${h3_111('Or Enter a Color')}				
				${entercolor111()}				
				${wrongInput_111()}
				<br>
				${html5Div_111()}
				<br>
				<br>
			</div>
		</div>
	</div>
	`;

	return mCreateFrom(html);

}
function part111() {
	let d = mDom(null, {}, { classes: 'w3-row' });
	let html = `
		<div class="w3-col colorthird1" style="text-align:center;">
			<h3>Pick a Color:</h3>
			<div style="margin:auto;width:236px;">
				<img style='margin-right:2px;' src='../copi2/w3/img_colormap.gif' usemap='#colormap' alt='colormap' />
				${map111()}				
				${script111()}				
				${selecthexagon111()}				
				${previewDiv_111()}				
				${h3_111('Or Enter a Color')}				
				${entercolor111()}				
				${wrongInput_111()}
				<br>
				${html5Div_111()}
				<br>
				<br>
			</div>
		</div>
	`;

	d.innerHTML = html;
	return d;

}
function part111() {
	let d = mDom(null, {}, { classes: 'w3-row' });
	let html = `
		<div class="w3-col colorthird1" style="text-align:center;">
			<h3>Pick a Color:</h3>
			<div style="margin:auto;width:236px;">
				<img style='margin-right:2px;' src='../copi2/img_colormap.gif' usemap='#colormap' alt='colormap' />
				${map111()}				
				${selecthexagon111()}				
				${previewDiv_111()}				
				<br>
			</div>
		</div>
	`;
	d.innerHTML = html;
	return d;
}
function part111() {
	let html = `
			<div style="margin:auto;width:236px;">
				<img style='margin-right:2px;' src='../copi2/img_colormap.gif' usemap='#colormap' alt='colormap' />
				${map111()}				
				${selecthexagon111()}				
				${previewDiv_111()}				
				<br>
			</div>
	`;
	return mCreateFrom(html);
}
function part111() {
	let html = `
			<div style="background-color:red;display:inline-block">
				<img style='margin-right:2px;' src='../copi2/img_colormap.gif' usemap='#colormap' alt='colormap' />
				${map111()}				
				${selecthexagon111()}				
				${previewDiv_111()}				
				<br>
			</div>
	`;
	return mCreateFrom(html);
}
function part111() {
	let html = `
			<div style="background-color:red;display:inline-block">
				<img src='../copi2/img_colormap.gif' usemap='#colormap' alt='colormap' />
				${map111()}				
				${selecthexagon111()}				
			</div>
	`;
	return mCreateFrom(html);
}
function part111() {
	let html = `
			<div style="background-color:red;display:inline-block;">
				<img src='../copi2/img_colormap.gif' usemap='#colormap' alt='colormap' />
				${map111()}				
				<div id="selectedhexagon"
				style='visibility:none;position:relative;margin-top:-21px;width:21px;height:21px;background-image:url("../copi2/img_selectedcolor.gif")'>
				</div>
			</div>
	`;
	return mCreateFrom(html);
}
function part111() {
	let html = `
			<div style="display:inline-block;height:199px">
				<img src='../copi2/img_colormap.gif' usemap='#colormap' alt='colormap' />
				${map111()}				
				${selecthexagon111()}				
			</div>
	`;
	return mCreateFrom(html);
}
function part111_mColorPicker(dParent) {
	let d = mDom(dParent);
	d.innerHTML = `
			<div style="display:inline-block;height:199px">
				<img src='../copi2/img_colormap.gif' usemap='#colormap' alt='colormap' />
				${map111()}				
				${selecthexagon111()}				
			</div>
	`;
	console.log('rect', getRect(d));
	return d;
}
//#endregion

function colormapHtml() {
	let html = `
	 <map id='colormap' name='colormap' onmouseout='mouseOutMap()'>
		<area style='cursor:pointer' shape='poly' coords='63,0,72,4,72,15,63,19,54,15,54,4' onclick='clickColor("#003366",-200,54)' onmouseover='mouseOverColor("#003366")' alt='#003366' />
		<area style='cursor:pointer' shape='poly' coords='81,0,90,4,90,15,81,19,72,15,72,4' onclick='clickColor("#336699",-200,72)' onmouseover='mouseOverColor("#336699")' alt='#336699' />
		<area style='cursor:pointer' shape='poly' coords='99,0,108,4,108,15,99,19,90,15,90,4' onclick='clickColor("#3366CC",-200,90)' onmouseover='mouseOverColor("#3366CC")' alt='#3366CC' />
		<area style='cursor:pointer' shape='poly' coords='117,0,126,4,126,15,117,19,108,15,108,4' onclick='clickColor("#003399",-200,108)' onmouseover='mouseOverColor("#003399")' alt='#003399' />
		<area style='cursor:pointer' shape='poly' coords='135,0,144,4,144,15,135,19,126,15,126,4' onclick='clickColor("#000099",-200,126)' onmouseover='mouseOverColor("#000099")' alt='#000099' />
		<area style='cursor:pointer' shape='poly' coords='153,0,162,4,162,15,153,19,144,15,144,4' onclick='clickColor("#0000CC",-200,144)' onmouseover='mouseOverColor("#0000CC")' alt='#0000CC' />
		<area style='cursor:pointer' shape='poly' coords='171,0,180,4,180,15,171,19,162,15,162,4' onclick='clickColor("#000066",-200,162)' onmouseover='mouseOverColor("#000066")' alt='#000066' />
		<area style='cursor:pointer' shape='poly' coords='54,15,63,19,63,30,54,34,45,30,45,19' onclick='clickColor("#006666",-185,45)' onmouseover='mouseOverColor("#006666")' alt='#006666' />
		<area style='cursor:pointer' shape='poly' coords='72,15,81,19,81,30,72,34,63,30,63,19' onclick='clickColor("#006699",-185,63)' onmouseover='mouseOverColor("#006699")' alt='#006699' />
		<area style='cursor:pointer' shape='poly' coords='90,15,99,19,99,30,90,34,81,30,81,19' onclick='clickColor("#0099CC",-185,81)' onmouseover='mouseOverColor("#0099CC")' alt='#0099CC' />
		<area style='cursor:pointer' shape='poly' coords='108,15,117,19,117,30,108,34,99,30,99,19' onclick='clickColor("#0066CC",-185,99)' onmouseover='mouseOverColor("#0066CC")' alt='#0066CC' />
		<area style='cursor:pointer' shape='poly' coords='126,15,135,19,135,30,126,34,117,30,117,19' onclick='clickColor("#0033CC",-185,117)' onmouseover='mouseOverColor("#0033CC")' alt='#0033CC' />
		<area style='cursor:pointer' shape='poly' coords='144,15,153,19,153,30,144,34,135,30,135,19' onclick='clickColor("#0000FF",-185,135)' onmouseover='mouseOverColor("#0000FF")' alt='#0000FF' />
		<area style='cursor:pointer' shape='poly' coords='162,15,171,19,171,30,162,34,153,30,153,19' onclick='clickColor("#3333FF",-185,153)' onmouseover='mouseOverColor("#3333FF")' alt='#3333FF' />
		<area style='cursor:pointer' shape='poly' coords='180,15,189,19,189,30,180,34,171,30,171,19' onclick='clickColor("#333399",-185,171)' onmouseover='mouseOverColor("#333399")' alt='#333399' />
		<area style='cursor:pointer' shape='poly' coords='45,30,54,34,54,45,45,49,36,45,36,34' onclick='clickColor("#669999",-170,36)' onmouseover='mouseOverColor("#669999")' alt='#669999' />
		<area style='cursor:pointer' shape='poly' coords='63,30,72,34,72,45,63,49,54,45,54,34' onclick='clickColor("#009999",-170,54)' onmouseover='mouseOverColor("#009999")' alt='#009999' />
		<area style='cursor:pointer' shape='poly' coords='81,30,90,34,90,45,81,49,72,45,72,34' onclick='clickColor("#33CCCC",-170,72)' onmouseover='mouseOverColor("#33CCCC")' alt='#33CCCC' />
		<area style='cursor:pointer' shape='poly' coords='99,30,108,34,108,45,99,49,90,45,90,34' onclick='clickColor("#00CCFF",-170,90)' onmouseover='mouseOverColor("#00CCFF")' alt='#00CCFF' />
		<area style='cursor:pointer' shape='poly' coords='117,30,126,34,126,45,117,49,108,45,108,34' onclick='clickColor("#0099FF",-170,108)' onmouseover='mouseOverColor("#0099FF")' alt='#0099FF' />
		<area style='cursor:pointer' shape='poly' coords='135,30,144,34,144,45,135,49,126,45,126,34' onclick='clickColor("#0066FF",-170,126)' onmouseover='mouseOverColor("#0066FF")' alt='#0066FF' />
		<area style='cursor:pointer' shape='poly' coords='153,30,162,34,162,45,153,49,144,45,144,34' onclick='clickColor("#3366FF",-170,144)' onmouseover='mouseOverColor("#3366FF")' alt='#3366FF' />
		<area style='cursor:pointer' shape='poly' coords='171,30,180,34,180,45,171,49,162,45,162,34' onclick='clickColor("#3333CC",-170,162)' onmouseover='mouseOverColor("#3333CC")' alt='#3333CC' />
		<area style='cursor:pointer' shape='poly' coords='189,30,198,34,198,45,189,49,180,45,180,34' onclick='clickColor("#666699",-170,180)' onmouseover='mouseOverColor("#666699")' alt='#666699' />
		<area style='cursor:pointer' shape='poly' coords='36,45,45,49,45,60,36,64,27,60,27,49' onclick='clickColor("#339966",-155,27)' onmouseover='mouseOverColor("#339966")' alt='#339966' />
		<area style='cursor:pointer' shape='poly' coords='54,45,63,49,63,60,54,64,45,60,45,49' onclick='clickColor("#00CC99",-155,45)' onmouseover='mouseOverColor("#00CC99")' alt='#00CC99' />
		<area style='cursor:pointer' shape='poly' coords='72,45,81,49,81,60,72,64,63,60,63,49' onclick='clickColor("#00FFCC",-155,63)' onmouseover='mouseOverColor("#00FFCC")' alt='#00FFCC' />
		<area style='cursor:pointer' shape='poly' coords='90,45,99,49,99,60,90,64,81,60,81,49' onclick='clickColor("#00FFFF",-155,81)' onmouseover='mouseOverColor("#00FFFF")' alt='#00FFFF' />
		<area style='cursor:pointer' shape='poly' coords='108,45,117,49,117,60,108,64,99,60,99,49' onclick='clickColor("#33CCFF",-155,99)' onmouseover='mouseOverColor("#33CCFF")' alt='#33CCFF' />
		<area style='cursor:pointer' shape='poly' coords='126,45,135,49,135,60,126,64,117,60,117,49' onclick='clickColor("#3399FF",-155,117)' onmouseover='mouseOverColor("#3399FF")' alt='#3399FF' />
		<area style='cursor:pointer' shape='poly' coords='144,45,153,49,153,60,144,64,135,60,135,49' onclick='clickColor("#6699FF",-155,135)' onmouseover='mouseOverColor("#6699FF")' alt='#6699FF' />
		<area style='cursor:pointer' shape='poly' coords='162,45,171,49,171,60,162,64,153,60,153,49' onclick='clickColor("#6666FF",-155,153)' onmouseover='mouseOverColor("#6666FF")' alt='#6666FF' />
		<area style='cursor:pointer' shape='poly' coords='180,45,189,49,189,60,180,64,171,60,171,49' onclick='clickColor("#6600FF",-155,171)' onmouseover='mouseOverColor("#6600FF")' alt='#6600FF' />
		<area style='cursor:pointer' shape='poly' coords='198,45,207,49,207,60,198,64,189,60,189,49' onclick='clickColor("#6600CC",-155,189)' onmouseover='mouseOverColor("#6600CC")' alt='#6600CC' />
		<area style='cursor:pointer' shape='poly' coords='27,60,36,64,36,75,27,79,18,75,18,64' onclick='clickColor("#339933",-140,18)' onmouseover='mouseOverColor("#339933")' alt='#339933' />
		<area style='cursor:pointer' shape='poly' coords='45,60,54,64,54,75,45,79,36,75,36,64' onclick='clickColor("#00CC66",-140,36)' onmouseover='mouseOverColor("#00CC66")' alt='#00CC66' />
		<area style='cursor:pointer' shape='poly' coords='63,60,72,64,72,75,63,79,54,75,54,64' onclick='clickColor("#00FF99",-140,54)' onmouseover='mouseOverColor("#00FF99")' alt='#00FF99' />
		<area style='cursor:pointer' shape='poly' coords='81,60,90,64,90,75,81,79,72,75,72,64' onclick='clickColor("#66FFCC",-140,72)' onmouseover='mouseOverColor("#66FFCC")' alt='#66FFCC' />
		<area style='cursor:pointer' shape='poly' coords='99,60,108,64,108,75,99,79,90,75,90,64' onclick='clickColor("#66FFFF",-140,90)' onmouseover='mouseOverColor("#66FFFF")' alt='#66FFFF' />
		<area style='cursor:pointer' shape='poly' coords='117,60,126,64,126,75,117,79,108,75,108,64' onclick='clickColor("#66CCFF",-140,108)' onmouseover='mouseOverColor("#66CCFF")' alt='#66CCFF' />
		<area style='cursor:pointer' shape='poly' coords='135,60,144,64,144,75,135,79,126,75,126,64' onclick='clickColor("#99CCFF",-140,126)' onmouseover='mouseOverColor("#99CCFF")' alt='#99CCFF' />
		<area style='cursor:pointer' shape='poly' coords='153,60,162,64,162,75,153,79,144,75,144,64' onclick='clickColor("#9999FF",-140,144)' onmouseover='mouseOverColor("#9999FF")' alt='#9999FF' />
		<area style='cursor:pointer' shape='poly' coords='171,60,180,64,180,75,171,79,162,75,162,64' onclick='clickColor("#9966FF",-140,162)' onmouseover='mouseOverColor("#9966FF")' alt='#9966FF' />
		<area style='cursor:pointer' shape='poly' coords='189,60,198,64,198,75,189,79,180,75,180,64' onclick='clickColor("#9933FF",-140,180)' onmouseover='mouseOverColor("#9933FF")' alt='#9933FF' />
		<area style='cursor:pointer' shape='poly' coords='207,60,216,64,216,75,207,79,198,75,198,64' onclick='clickColor("#9900FF",-140,198)' onmouseover='mouseOverColor("#9900FF")' alt='#9900FF' />
		<area style='cursor:pointer' shape='poly' coords='18,75,27,79,27,90,18,94,9,90,9,79' onclick='clickColor("#006600",-125,9)' onmouseover='mouseOverColor("#006600")' alt='#006600' />
		<area style='cursor:pointer' shape='poly' coords='36,75,45,79,45,90,36,94,27,90,27,79' onclick='clickColor("#00CC00",-125,27)' onmouseover='mouseOverColor("#00CC00")' alt='#00CC00' />
		<area style='cursor:pointer' shape='poly' coords='54,75,63,79,63,90,54,94,45,90,45,79' onclick='clickColor("#00FF00",-125,45)' onmouseover='mouseOverColor("#00FF00")' alt='#00FF00' />
		<area style='cursor:pointer' shape='poly' coords='72,75,81,79,81,90,72,94,63,90,63,79' onclick='clickColor("#66FF99",-125,63)' onmouseover='mouseOverColor("#66FF99")' alt='#66FF99' />
		<area style='cursor:pointer' shape='poly' coords='90,75,99,79,99,90,90,94,81,90,81,79' onclick='clickColor("#99FFCC",-125,81)' onmouseover='mouseOverColor("#99FFCC")' alt='#99FFCC' />
		<area style='cursor:pointer' shape='poly' coords='108,75,117,79,117,90,108,94,99,90,99,79' onclick='clickColor("#CCFFFF",-125,99)' onmouseover='mouseOverColor("#CCFFFF")' alt='#CCFFFF' />
		<area style='cursor:pointer' shape='poly' coords='126,75,135,79,135,90,126,94,117,90,117,79' onclick='clickColor("#CCCCFF",-125,117)' onmouseover='mouseOverColor("#CCCCFF")' alt='#CCCCFF' />
		<area style='cursor:pointer' shape='poly' coords='144,75,153,79,153,90,144,94,135,90,135,79' onclick='clickColor("#CC99FF",-125,135)' onmouseover='mouseOverColor("#CC99FF")' alt='#CC99FF' />
		<area style='cursor:pointer' shape='poly' coords='162,75,171,79,171,90,162,94,153,90,153,79' onclick='clickColor("#CC66FF",-125,153)' onmouseover='mouseOverColor("#CC66FF")' alt='#CC66FF' />
		<area style='cursor:pointer' shape='poly' coords='180,75,189,79,189,90,180,94,171,90,171,79' onclick='clickColor("#CC33FF",-125,171)' onmouseover='mouseOverColor("#CC33FF")' alt='#CC33FF' />
		<area style='cursor:pointer' shape='poly' coords='198,75,207,79,207,90,198,94,189,90,189,79' onclick='clickColor("#CC00FF",-125,189)' onmouseover='mouseOverColor("#CC00FF")' alt='#CC00FF' />
		<area style='cursor:pointer' shape='poly' coords='216,75,225,79,225,90,216,94,207,90,207,79' onclick='clickColor("#9900CC",-125,207)' onmouseover='mouseOverColor("#9900CC")' alt='#9900CC' />
		<area style='cursor:pointer' shape='poly' coords='9,90,18,94,18,105,9,109,0,105,0,94' onclick='clickColor("#003300",-110,0)' onmouseover='mouseOverColor("#003300")' alt='#003300' />
		<area style='cursor:pointer' shape='poly' coords='27,90,36,94,36,105,27,109,18,105,18,94' onclick='clickColor("#009933",-110,18)' onmouseover='mouseOverColor("#009933")' alt='#009933' />
		<area style='cursor:pointer' shape='poly' coords='45,90,54,94,54,105,45,109,36,105,36,94' onclick='clickColor("#33CC33",-110,36)' onmouseover='mouseOverColor("#33CC33")' alt='#33CC33' />
		<area style='cursor:pointer' shape='poly' coords='63,90,72,94,72,105,63,109,54,105,54,94' onclick='clickColor("#66FF66",-110,54)' onmouseover='mouseOverColor("#66FF66")' alt='#66FF66' />
		<area style='cursor:pointer' shape='poly' coords='81,90,90,94,90,105,81,109,72,105,72,94' onclick='clickColor("#99FF99",-110,72)' onmouseover='mouseOverColor("#99FF99")' alt='#99FF99' />
		<area style='cursor:pointer' shape='poly' coords='99,90,108,94,108,105,99,109,90,105,90,94' onclick='clickColor("#CCFFCC",-110,90)' onmouseover='mouseOverColor("#CCFFCC")' alt='#CCFFCC' />
		<area style='cursor:pointer' shape='poly' coords='117,90,126,94,126,105,117,109,108,105,108,94' onclick='clickColor("#FFFFFF",-110,108)' onmouseover='mouseOverColor("#FFFFFF")' alt='#FFFFFF' />
		<area style='cursor:pointer' shape='poly' coords='135,90,144,94,144,105,135,109,126,105,126,94' onclick='clickColor("#FFCCFF",-110,126)' onmouseover='mouseOverColor("#FFCCFF")' alt='#FFCCFF' />
		<area style='cursor:pointer' shape='poly' coords='153,90,162,94,162,105,153,109,144,105,144,94' onclick='clickColor("#FF99FF",-110,144)' onmouseover='mouseOverColor("#FF99FF")' alt='#FF99FF' />
		<area style='cursor:pointer' shape='poly' coords='171,90,180,94,180,105,171,109,162,105,162,94' onclick='clickColor("#FF66FF",-110,162)' onmouseover='mouseOverColor("#FF66FF")' alt='#FF66FF' />
		<area style='cursor:pointer' shape='poly' coords='189,90,198,94,198,105,189,109,180,105,180,94' onclick='clickColor("#FF00FF",-110,180)' onmouseover='mouseOverColor("#FF00FF")' alt='#FF00FF' />
		<area style='cursor:pointer' shape='poly' coords='207,90,216,94,216,105,207,109,198,105,198,94' onclick='clickColor("#CC00CC",-110,198)' onmouseover='mouseOverColor("#CC00CC")' alt='#CC00CC' />
		<area style='cursor:pointer' shape='poly' coords='225,90,234,94,234,105,225,109,216,105,216,94' onclick='clickColor("#660066",-110,216)' onmouseover='mouseOverColor("#660066")' alt='#660066' />
		<area style='cursor:pointer' shape='poly' coords='18,105,27,109,27,120,18,124,9,120,9,109' onclick='clickColor("#336600",-95,9)' onmouseover='mouseOverColor("#336600")' alt='#336600' />
		<area style='cursor:pointer' shape='poly' coords='36,105,45,109,45,120,36,124,27,120,27,109' onclick='clickColor("#009900",-95,27)' onmouseover='mouseOverColor("#009900")' alt='#009900' />
		<area style='cursor:pointer' shape='poly' coords='54,105,63,109,63,120,54,124,45,120,45,109' onclick='clickColor("#66FF33",-95,45)' onmouseover='mouseOverColor("#66FF33")' alt='#66FF33' />
		<area style='cursor:pointer' shape='poly' coords='72,105,81,109,81,120,72,124,63,120,63,109' onclick='clickColor("#99FF66",-95,63)' onmouseover='mouseOverColor("#99FF66")' alt='#99FF66' />
		<area style='cursor:pointer' shape='poly' coords='90,105,99,109,99,120,90,124,81,120,81,109' onclick='clickColor("#CCFF99",-95,81)' onmouseover='mouseOverColor("#CCFF99")' alt='#CCFF99' />
		<area style='cursor:pointer' shape='poly' coords='108,105,117,109,117,120,108,124,99,120,99,109' onclick='clickColor("#FFFFCC",-95,99)' onmouseover='mouseOverColor("#FFFFCC")' alt='#FFFFCC' />
		<area style='cursor:pointer' shape='poly' coords='126,105,135,109,135,120,126,124,117,120,117,109' onclick='clickColor("#FFCCCC",-95,117)' onmouseover='mouseOverColor("#FFCCCC")' alt='#FFCCCC' />
		<area style='cursor:pointer' shape='poly' coords='144,105,153,109,153,120,144,124,135,120,135,109' onclick='clickColor("#FF99CC",-95,135)' onmouseover='mouseOverColor("#FF99CC")' alt='#FF99CC' />
		<area style='cursor:pointer' shape='poly' coords='162,105,171,109,171,120,162,124,153,120,153,109' onclick='clickColor("#FF66CC",-95,153)' onmouseover='mouseOverColor("#FF66CC")' alt='#FF66CC' />
		<area style='cursor:pointer' shape='poly' coords='180,105,189,109,189,120,180,124,171,120,171,109' onclick='clickColor("#FF33CC",-95,171)' onmouseover='mouseOverColor("#FF33CC")' alt='#FF33CC' />
		<area style='cursor:pointer' shape='poly' coords='198,105,207,109,207,120,198,124,189,120,189,109' onclick='clickColor("#CC0099",-95,189)' onmouseover='mouseOverColor("#CC0099")' alt='#CC0099' />
		<area style='cursor:pointer' shape='poly' coords='216,105,225,109,225,120,216,124,207,120,207,109' onclick='clickColor("#993399",-95,207)' onmouseover='mouseOverColor("#993399")' alt='#993399' />
		<area style='cursor:pointer' shape='poly' coords='27,120,36,124,36,135,27,139,18,135,18,124' onclick='clickColor("#333300",-80,18)' onmouseover='mouseOverColor("#333300")' alt='#333300' />
		<area style='cursor:pointer' shape='poly' coords='45,120,54,124,54,135,45,139,36,135,36,124' onclick='clickColor("#669900",-80,36)' onmouseover='mouseOverColor("#669900")' alt='#669900' />
		<area style='cursor:pointer' shape='poly' coords='63,120,72,124,72,135,63,139,54,135,54,124' onclick='clickColor("#99FF33",-80,54)' onmouseover='mouseOverColor("#99FF33")' alt='#99FF33' />
		<area style='cursor:pointer' shape='poly' coords='81,120,90,124,90,135,81,139,72,135,72,124' onclick='clickColor("#CCFF66",-80,72)' onmouseover='mouseOverColor("#CCFF66")' alt='#CCFF66' />
		<area style='cursor:pointer' shape='poly' coords='99,120,108,124,108,135,99,139,90,135,90,124' onclick='clickColor("#FFFF99",-80,90)' onmouseover='mouseOverColor("#FFFF99")' alt='#FFFF99' />
		<area style='cursor:pointer' shape='poly' coords='117,120,126,124,126,135,117,139,108,135,108,124' onclick='clickColor("#FFCC99",-80,108)' onmouseover='mouseOverColor("#FFCC99")' alt='#FFCC99' />
		<area style='cursor:pointer' shape='poly' coords='135,120,144,124,144,135,135,139,126,135,126,124' onclick='clickColor("#FF9999",-80,126)' onmouseover='mouseOverColor("#FF9999")' alt='#FF9999' />
		<area style='cursor:pointer' shape='poly' coords='153,120,162,124,162,135,153,139,144,135,144,124' onclick='clickColor("#FF6699",-80,144)' onmouseover='mouseOverColor("#FF6699")' alt='#FF6699' />
		<area style='cursor:pointer' shape='poly' coords='171,120,180,124,180,135,171,139,162,135,162,124' onclick='clickColor("#FF3399",-80,162)' onmouseover='mouseOverColor("#FF3399")' alt='#FF3399' />
		<area style='cursor:pointer' shape='poly' coords='189,120,198,124,198,135,189,139,180,135,180,124' onclick='clickColor("#CC3399",-80,180)' onmouseover='mouseOverColor("#CC3399")' alt='#CC3399' />
		<area style='cursor:pointer' shape='poly' coords='207,120,216,124,216,135,207,139,198,135,198,124' onclick='clickColor("#990099",-80,198)' onmouseover='mouseOverColor("#990099")' alt='#990099' />
		<area style='cursor:pointer' shape='poly' coords='36,135,45,139,45,150,36,154,27,150,27,139' onclick='clickColor("#666633",-65,27)' onmouseover='mouseOverColor("#666633")' alt='#666633' />
		<area style='cursor:pointer' shape='poly' coords='54,135,63,139,63,150,54,154,45,150,45,139' onclick='clickColor("#99CC00",-65,45)' onmouseover='mouseOverColor("#99CC00")' alt='#99CC00' />
		<area style='cursor:pointer' shape='poly' coords='72,135,81,139,81,150,72,154,63,150,63,139' onclick='clickColor("#CCFF33",-65,63)' onmouseover='mouseOverColor("#CCFF33")' alt='#CCFF33' />
		<area style='cursor:pointer' shape='poly' coords='90,135,99,139,99,150,90,154,81,150,81,139' onclick='clickColor("#FFFF66",-65,81)' onmouseover='mouseOverColor("#FFFF66")' alt='#FFFF66' />
		<area style='cursor:pointer' shape='poly' coords='108,135,117,139,117,150,108,154,99,150,99,139' onclick='clickColor("#FFCC66",-65,99)' onmouseover='mouseOverColor("#FFCC66")' alt='#FFCC66' />
		<area style='cursor:pointer' shape='poly' coords='126,135,135,139,135,150,126,154,117,150,117,139' onclick='clickColor("#FF9966",-65,117)' onmouseover='mouseOverColor("#FF9966")' alt='#FF9966' />
		<area style='cursor:pointer' shape='poly' coords='144,135,153,139,153,150,144,154,135,150,135,139' onclick='clickColor("#FF6666",-65,135)' onmouseover='mouseOverColor("#FF6666")' alt='#FF6666' />
		<area style='cursor:pointer' shape='poly' coords='162,135,171,139,171,150,162,154,153,150,153,139' onclick='clickColor("#FF0066",-65,153)' onmouseover='mouseOverColor("#FF0066")' alt='#FF0066' />
		<area style='cursor:pointer' shape='poly' coords='180,135,189,139,189,150,180,154,171,150,171,139' onclick='clickColor("#CC6699",-65,171)' onmouseover='mouseOverColor("#CC6699")' alt='#CC6699' />
		<area style='cursor:pointer' shape='poly' coords='198,135,207,139,207,150,198,154,189,150,189,139' onclick='clickColor("#993366",-65,189)' onmouseover='mouseOverColor("#993366")' alt='#993366' />
		<area style='cursor:pointer' shape='poly' coords='45,150,54,154,54,165,45,169,36,165,36,154' onclick='clickColor("#999966",-50,36)' onmouseover='mouseOverColor("#999966")' alt='#999966' />
		<area style='cursor:pointer' shape='poly' coords='63,150,72,154,72,165,63,169,54,165,54,154' onclick='clickColor("#CCCC00",-50,54)' onmouseover='mouseOverColor("#CCCC00")' alt='#CCCC00' />
		<area style='cursor:pointer' shape='poly' coords='81,150,90,154,90,165,81,169,72,165,72,154' onclick='clickColor("#FFFF00",-50,72)' onmouseover='mouseOverColor("#FFFF00")' alt='#FFFF00' />
		<area style='cursor:pointer' shape='poly' coords='99,150,108,154,108,165,99,169,90,165,90,154' onclick='clickColor("#FFCC00",-50,90)' onmouseover='mouseOverColor("#FFCC00")' alt='#FFCC00' />
		<area style='cursor:pointer' shape='poly' coords='117,150,126,154,126,165,117,169,108,165,108,154' onclick='clickColor("#FF9933",-50,108)' onmouseover='mouseOverColor("#FF9933")' alt='#FF9933' />
		<area style='cursor:pointer' shape='poly' coords='135,150,144,154,144,165,135,169,126,165,126,154' onclick='clickColor("#FF6600",-50,126)' onmouseover='mouseOverColor("#FF6600")' alt='#FF6600' />
		<area style='cursor:pointer' shape='poly' coords='153,150,162,154,162,165,153,169,144,165,144,154' onclick='clickColor("#FF5050",-50,144)' onmouseover='mouseOverColor("#FF5050")' alt='#FF5050' />
		<area style='cursor:pointer' shape='poly' coords='171,150,180,154,180,165,171,169,162,165,162,154' onclick='clickColor("#CC0066",-50,162)' onmouseover='mouseOverColor("#CC0066")' alt='#CC0066' />
		<area style='cursor:pointer' shape='poly' coords='189,150,198,154,198,165,189,169,180,165,180,154' onclick='clickColor("#660033",-50,180)' onmouseover='mouseOverColor("#660033")' alt='#660033' />
		<area style='cursor:pointer' shape='poly' coords='54,165,63,169,63,180,54,184,45,180,45,169' onclick='clickColor("#996633",-35,45)' onmouseover='mouseOverColor("#996633")' alt='#996633' />
		<area style='cursor:pointer' shape='poly' coords='72,165,81,169,81,180,72,184,63,180,63,169' onclick='clickColor("#CC9900",-35,63)' onmouseover='mouseOverColor("#CC9900")' alt='#CC9900' />
		<area style='cursor:pointer' shape='poly' coords='90,165,99,169,99,180,90,184,81,180,81,169' onclick='clickColor("#FF9900",-35,81)' onmouseover='mouseOverColor("#FF9900")' alt='#FF9900' />
		<area style='cursor:pointer' shape='poly' coords='108,165,117,169,117,180,108,184,99,180,99,169' onclick='clickColor("#CC6600",-35,99)' onmouseover='mouseOverColor("#CC6600")' alt='#CC6600' />
		<area style='cursor:pointer' shape='poly' coords='126,165,135,169,135,180,126,184,117,180,117,169' onclick='clickColor("#FF3300",-35,117)' onmouseover='mouseOverColor("#FF3300")' alt='#FF3300' />
		<area style='cursor:pointer' shape='poly' coords='144,165,153,169,153,180,144,184,135,180,135,169' onclick='clickColor("#FF0000",-35,135)' onmouseover='mouseOverColor("#FF0000")' alt='#FF0000' />
		<area style='cursor:pointer' shape='poly' coords='162,165,171,169,171,180,162,184,153,180,153,169' onclick='clickColor("#CC0000",-35,153)' onmouseover='mouseOverColor("#CC0000")' alt='#CC0000' />
		<area style='cursor:pointer' shape='poly' coords='180,165,189,169,189,180,180,184,171,180,171,169' onclick='clickColor("#990033",-35,171)' onmouseover='mouseOverColor("#990033")' alt='#990033' />
		<area style='cursor:pointer' shape='poly' coords='63,180,72,184,72,195,63,199,54,195,54,184' onclick='clickColor("#663300",-20,54)' onmouseover='mouseOverColor("#663300")' alt='#663300' />
		<area style='cursor:pointer' shape='poly' coords='81,180,90,184,90,195,81,199,72,195,72,184' onclick='clickColor("#996600",-20,72)' onmouseover='mouseOverColor("#996600")' alt='#996600' />
		<area style='cursor:pointer' shape='poly' coords='99,180,108,184,108,195,99,199,90,195,90,184' onclick='clickColor("#CC3300",-20,90)' onmouseover='mouseOverColor("#CC3300")' alt='#CC3300' />
		<area style='cursor:pointer' shape='poly' coords='117,180,126,184,126,195,117,199,108,195,108,184' onclick='clickColor("#993300",-20,108)' onmouseover='mouseOverColor("#993300")' alt='#993300' />
		<area style='cursor:pointer' shape='poly' coords='135,180,144,184,144,195,135,199,126,195,126,184' onclick='clickColor("#990000",-20,126)' onmouseover='mouseOverColor("#990000")' alt='#990000' />
		<area style='cursor:pointer' shape='poly' coords='153,180,162,184,162,195,153,199,144,195,144,184' onclick='clickColor("#800000",-20,144)' onmouseover='mouseOverColor("#800000")' alt='#800000' />
		<area style='cursor:pointer' shape='poly' coords='171,180,180,184,180,195,171,199,162,195,162,184' onclick='clickColor("#993333",-20,162)' onmouseover='mouseOverColor("#993333")' alt='#993333' />
	 </map>
	 `;
	return mCreateFrom(html);
}
function colormapHtml(dParent) {
	let map = mDom(dParent,{},{tag:'map', id:'colormap', onmouseout:mouseOutMap});
	let html = colormapAsString();
	map.innerHTML = html;
	return map; //mCreateFrom(html);
}
function colormapAsString(){
	let html = `
		<area style='cursor:pointer' shape='poly' coords='63,0,72,4,72,15,63,19,54,15,54,4' onclick='clickColor("#003366",-200,54)' onmouseover='mouseOverColor("#003366")' alt='#003366' />
		<area style='cursor:pointer' shape='poly' coords='81,0,90,4,90,15,81,19,72,15,72,4' onclick='clickColor("#336699",-200,72)' onmouseover='mouseOverColor("#336699")' alt='#336699' />
		<area style='cursor:pointer' shape='poly' coords='99,0,108,4,108,15,99,19,90,15,90,4' onclick='clickColor("#3366CC",-200,90)' onmouseover='mouseOverColor("#3366CC")' alt='#3366CC' />
		<area style='cursor:pointer' shape='poly' coords='117,0,126,4,126,15,117,19,108,15,108,4' onclick='clickColor("#003399",-200,108)' onmouseover='mouseOverColor("#003399")' alt='#003399' />
		<area style='cursor:pointer' shape='poly' coords='135,0,144,4,144,15,135,19,126,15,126,4' onclick='clickColor("#000099",-200,126)' onmouseover='mouseOverColor("#000099")' alt='#000099' />
		<area style='cursor:pointer' shape='poly' coords='153,0,162,4,162,15,153,19,144,15,144,4' onclick='clickColor("#0000CC",-200,144)' onmouseover='mouseOverColor("#0000CC")' alt='#0000CC' />
		<area style='cursor:pointer' shape='poly' coords='171,0,180,4,180,15,171,19,162,15,162,4' onclick='clickColor("#000066",-200,162)' onmouseover='mouseOverColor("#000066")' alt='#000066' />
		<area style='cursor:pointer' shape='poly' coords='54,15,63,19,63,30,54,34,45,30,45,19' onclick='clickColor("#006666",-185,45)' onmouseover='mouseOverColor("#006666")' alt='#006666' />
		<area style='cursor:pointer' shape='poly' coords='72,15,81,19,81,30,72,34,63,30,63,19' onclick='clickColor("#006699",-185,63)' onmouseover='mouseOverColor("#006699")' alt='#006699' />
		<area style='cursor:pointer' shape='poly' coords='90,15,99,19,99,30,90,34,81,30,81,19' onclick='clickColor("#0099CC",-185,81)' onmouseover='mouseOverColor("#0099CC")' alt='#0099CC' />
		<area style='cursor:pointer' shape='poly' coords='108,15,117,19,117,30,108,34,99,30,99,19' onclick='clickColor("#0066CC",-185,99)' onmouseover='mouseOverColor("#0066CC")' alt='#0066CC' />
		<area style='cursor:pointer' shape='poly' coords='126,15,135,19,135,30,126,34,117,30,117,19' onclick='clickColor("#0033CC",-185,117)' onmouseover='mouseOverColor("#0033CC")' alt='#0033CC' />
		<area style='cursor:pointer' shape='poly' coords='144,15,153,19,153,30,144,34,135,30,135,19' onclick='clickColor("#0000FF",-185,135)' onmouseover='mouseOverColor("#0000FF")' alt='#0000FF' />
		<area style='cursor:pointer' shape='poly' coords='162,15,171,19,171,30,162,34,153,30,153,19' onclick='clickColor("#3333FF",-185,153)' onmouseover='mouseOverColor("#3333FF")' alt='#3333FF' />
		<area style='cursor:pointer' shape='poly' coords='180,15,189,19,189,30,180,34,171,30,171,19' onclick='clickColor("#333399",-185,171)' onmouseover='mouseOverColor("#333399")' alt='#333399' />
		<area style='cursor:pointer' shape='poly' coords='45,30,54,34,54,45,45,49,36,45,36,34' onclick='clickColor("#669999",-170,36)' onmouseover='mouseOverColor("#669999")' alt='#669999' />
		<area style='cursor:pointer' shape='poly' coords='63,30,72,34,72,45,63,49,54,45,54,34' onclick='clickColor("#009999",-170,54)' onmouseover='mouseOverColor("#009999")' alt='#009999' />
		<area style='cursor:pointer' shape='poly' coords='81,30,90,34,90,45,81,49,72,45,72,34' onclick='clickColor("#33CCCC",-170,72)' onmouseover='mouseOverColor("#33CCCC")' alt='#33CCCC' />
		<area style='cursor:pointer' shape='poly' coords='99,30,108,34,108,45,99,49,90,45,90,34' onclick='clickColor("#00CCFF",-170,90)' onmouseover='mouseOverColor("#00CCFF")' alt='#00CCFF' />
		<area style='cursor:pointer' shape='poly' coords='117,30,126,34,126,45,117,49,108,45,108,34' onclick='clickColor("#0099FF",-170,108)' onmouseover='mouseOverColor("#0099FF")' alt='#0099FF' />
		<area style='cursor:pointer' shape='poly' coords='135,30,144,34,144,45,135,49,126,45,126,34' onclick='clickColor("#0066FF",-170,126)' onmouseover='mouseOverColor("#0066FF")' alt='#0066FF' />
		<area style='cursor:pointer' shape='poly' coords='153,30,162,34,162,45,153,49,144,45,144,34' onclick='clickColor("#3366FF",-170,144)' onmouseover='mouseOverColor("#3366FF")' alt='#3366FF' />
		<area style='cursor:pointer' shape='poly' coords='171,30,180,34,180,45,171,49,162,45,162,34' onclick='clickColor("#3333CC",-170,162)' onmouseover='mouseOverColor("#3333CC")' alt='#3333CC' />
		<area style='cursor:pointer' shape='poly' coords='189,30,198,34,198,45,189,49,180,45,180,34' onclick='clickColor("#666699",-170,180)' onmouseover='mouseOverColor("#666699")' alt='#666699' />
		<area style='cursor:pointer' shape='poly' coords='36,45,45,49,45,60,36,64,27,60,27,49' onclick='clickColor("#339966",-155,27)' onmouseover='mouseOverColor("#339966")' alt='#339966' />
		<area style='cursor:pointer' shape='poly' coords='54,45,63,49,63,60,54,64,45,60,45,49' onclick='clickColor("#00CC99",-155,45)' onmouseover='mouseOverColor("#00CC99")' alt='#00CC99' />
		<area style='cursor:pointer' shape='poly' coords='72,45,81,49,81,60,72,64,63,60,63,49' onclick='clickColor("#00FFCC",-155,63)' onmouseover='mouseOverColor("#00FFCC")' alt='#00FFCC' />
		<area style='cursor:pointer' shape='poly' coords='90,45,99,49,99,60,90,64,81,60,81,49' onclick='clickColor("#00FFFF",-155,81)' onmouseover='mouseOverColor("#00FFFF")' alt='#00FFFF' />
		<area style='cursor:pointer' shape='poly' coords='108,45,117,49,117,60,108,64,99,60,99,49' onclick='clickColor("#33CCFF",-155,99)' onmouseover='mouseOverColor("#33CCFF")' alt='#33CCFF' />
		<area style='cursor:pointer' shape='poly' coords='126,45,135,49,135,60,126,64,117,60,117,49' onclick='clickColor("#3399FF",-155,117)' onmouseover='mouseOverColor("#3399FF")' alt='#3399FF' />
		<area style='cursor:pointer' shape='poly' coords='144,45,153,49,153,60,144,64,135,60,135,49' onclick='clickColor("#6699FF",-155,135)' onmouseover='mouseOverColor("#6699FF")' alt='#6699FF' />
		<area style='cursor:pointer' shape='poly' coords='162,45,171,49,171,60,162,64,153,60,153,49' onclick='clickColor("#6666FF",-155,153)' onmouseover='mouseOverColor("#6666FF")' alt='#6666FF' />
		<area style='cursor:pointer' shape='poly' coords='180,45,189,49,189,60,180,64,171,60,171,49' onclick='clickColor("#6600FF",-155,171)' onmouseover='mouseOverColor("#6600FF")' alt='#6600FF' />
		<area style='cursor:pointer' shape='poly' coords='198,45,207,49,207,60,198,64,189,60,189,49' onclick='clickColor("#6600CC",-155,189)' onmouseover='mouseOverColor("#6600CC")' alt='#6600CC' />
		<area style='cursor:pointer' shape='poly' coords='27,60,36,64,36,75,27,79,18,75,18,64' onclick='clickColor("#339933",-140,18)' onmouseover='mouseOverColor("#339933")' alt='#339933' />
		<area style='cursor:pointer' shape='poly' coords='45,60,54,64,54,75,45,79,36,75,36,64' onclick='clickColor("#00CC66",-140,36)' onmouseover='mouseOverColor("#00CC66")' alt='#00CC66' />
		<area style='cursor:pointer' shape='poly' coords='63,60,72,64,72,75,63,79,54,75,54,64' onclick='clickColor("#00FF99",-140,54)' onmouseover='mouseOverColor("#00FF99")' alt='#00FF99' />
		<area style='cursor:pointer' shape='poly' coords='81,60,90,64,90,75,81,79,72,75,72,64' onclick='clickColor("#66FFCC",-140,72)' onmouseover='mouseOverColor("#66FFCC")' alt='#66FFCC' />
		<area style='cursor:pointer' shape='poly' coords='99,60,108,64,108,75,99,79,90,75,90,64' onclick='clickColor("#66FFFF",-140,90)' onmouseover='mouseOverColor("#66FFFF")' alt='#66FFFF' />
		<area style='cursor:pointer' shape='poly' coords='117,60,126,64,126,75,117,79,108,75,108,64' onclick='clickColor("#66CCFF",-140,108)' onmouseover='mouseOverColor("#66CCFF")' alt='#66CCFF' />
		<area style='cursor:pointer' shape='poly' coords='135,60,144,64,144,75,135,79,126,75,126,64' onclick='clickColor("#99CCFF",-140,126)' onmouseover='mouseOverColor("#99CCFF")' alt='#99CCFF' />
		<area style='cursor:pointer' shape='poly' coords='153,60,162,64,162,75,153,79,144,75,144,64' onclick='clickColor("#9999FF",-140,144)' onmouseover='mouseOverColor("#9999FF")' alt='#9999FF' />
		<area style='cursor:pointer' shape='poly' coords='171,60,180,64,180,75,171,79,162,75,162,64' onclick='clickColor("#9966FF",-140,162)' onmouseover='mouseOverColor("#9966FF")' alt='#9966FF' />
		<area style='cursor:pointer' shape='poly' coords='189,60,198,64,198,75,189,79,180,75,180,64' onclick='clickColor("#9933FF",-140,180)' onmouseover='mouseOverColor("#9933FF")' alt='#9933FF' />
		<area style='cursor:pointer' shape='poly' coords='207,60,216,64,216,75,207,79,198,75,198,64' onclick='clickColor("#9900FF",-140,198)' onmouseover='mouseOverColor("#9900FF")' alt='#9900FF' />
		<area style='cursor:pointer' shape='poly' coords='18,75,27,79,27,90,18,94,9,90,9,79' onclick='clickColor("#006600",-125,9)' onmouseover='mouseOverColor("#006600")' alt='#006600' />
		<area style='cursor:pointer' shape='poly' coords='36,75,45,79,45,90,36,94,27,90,27,79' onclick='clickColor("#00CC00",-125,27)' onmouseover='mouseOverColor("#00CC00")' alt='#00CC00' />
		<area style='cursor:pointer' shape='poly' coords='54,75,63,79,63,90,54,94,45,90,45,79' onclick='clickColor("#00FF00",-125,45)' onmouseover='mouseOverColor("#00FF00")' alt='#00FF00' />
		<area style='cursor:pointer' shape='poly' coords='72,75,81,79,81,90,72,94,63,90,63,79' onclick='clickColor("#66FF99",-125,63)' onmouseover='mouseOverColor("#66FF99")' alt='#66FF99' />
		<area style='cursor:pointer' shape='poly' coords='90,75,99,79,99,90,90,94,81,90,81,79' onclick='clickColor("#99FFCC",-125,81)' onmouseover='mouseOverColor("#99FFCC")' alt='#99FFCC' />
		<area style='cursor:pointer' shape='poly' coords='108,75,117,79,117,90,108,94,99,90,99,79' onclick='clickColor("#CCFFFF",-125,99)' onmouseover='mouseOverColor("#CCFFFF")' alt='#CCFFFF' />
		<area style='cursor:pointer' shape='poly' coords='126,75,135,79,135,90,126,94,117,90,117,79' onclick='clickColor("#CCCCFF",-125,117)' onmouseover='mouseOverColor("#CCCCFF")' alt='#CCCCFF' />
		<area style='cursor:pointer' shape='poly' coords='144,75,153,79,153,90,144,94,135,90,135,79' onclick='clickColor("#CC99FF",-125,135)' onmouseover='mouseOverColor("#CC99FF")' alt='#CC99FF' />
		<area style='cursor:pointer' shape='poly' coords='162,75,171,79,171,90,162,94,153,90,153,79' onclick='clickColor("#CC66FF",-125,153)' onmouseover='mouseOverColor("#CC66FF")' alt='#CC66FF' />
		<area style='cursor:pointer' shape='poly' coords='180,75,189,79,189,90,180,94,171,90,171,79' onclick='clickColor("#CC33FF",-125,171)' onmouseover='mouseOverColor("#CC33FF")' alt='#CC33FF' />
		<area style='cursor:pointer' shape='poly' coords='198,75,207,79,207,90,198,94,189,90,189,79' onclick='clickColor("#CC00FF",-125,189)' onmouseover='mouseOverColor("#CC00FF")' alt='#CC00FF' />
		<area style='cursor:pointer' shape='poly' coords='216,75,225,79,225,90,216,94,207,90,207,79' onclick='clickColor("#9900CC",-125,207)' onmouseover='mouseOverColor("#9900CC")' alt='#9900CC' />
		<area style='cursor:pointer' shape='poly' coords='9,90,18,94,18,105,9,109,0,105,0,94' onclick='clickColor("#003300",-110,0)' onmouseover='mouseOverColor("#003300")' alt='#003300' />
		<area style='cursor:pointer' shape='poly' coords='27,90,36,94,36,105,27,109,18,105,18,94' onclick='clickColor("#009933",-110,18)' onmouseover='mouseOverColor("#009933")' alt='#009933' />
		<area style='cursor:pointer' shape='poly' coords='45,90,54,94,54,105,45,109,36,105,36,94' onclick='clickColor("#33CC33",-110,36)' onmouseover='mouseOverColor("#33CC33")' alt='#33CC33' />
		<area style='cursor:pointer' shape='poly' coords='63,90,72,94,72,105,63,109,54,105,54,94' onclick='clickColor("#66FF66",-110,54)' onmouseover='mouseOverColor("#66FF66")' alt='#66FF66' />
		<area style='cursor:pointer' shape='poly' coords='81,90,90,94,90,105,81,109,72,105,72,94' onclick='clickColor("#99FF99",-110,72)' onmouseover='mouseOverColor("#99FF99")' alt='#99FF99' />
		<area style='cursor:pointer' shape='poly' coords='99,90,108,94,108,105,99,109,90,105,90,94' onclick='clickColor("#CCFFCC",-110,90)' onmouseover='mouseOverColor("#CCFFCC")' alt='#CCFFCC' />
		<area style='cursor:pointer' shape='poly' coords='117,90,126,94,126,105,117,109,108,105,108,94' onclick='clickColor("#FFFFFF",-110,108)' onmouseover='mouseOverColor("#FFFFFF")' alt='#FFFFFF' />
		<area style='cursor:pointer' shape='poly' coords='135,90,144,94,144,105,135,109,126,105,126,94' onclick='clickColor("#FFCCFF",-110,126)' onmouseover='mouseOverColor("#FFCCFF")' alt='#FFCCFF' />
		<area style='cursor:pointer' shape='poly' coords='153,90,162,94,162,105,153,109,144,105,144,94' onclick='clickColor("#FF99FF",-110,144)' onmouseover='mouseOverColor("#FF99FF")' alt='#FF99FF' />
		<area style='cursor:pointer' shape='poly' coords='171,90,180,94,180,105,171,109,162,105,162,94' onclick='clickColor("#FF66FF",-110,162)' onmouseover='mouseOverColor("#FF66FF")' alt='#FF66FF' />
		<area style='cursor:pointer' shape='poly' coords='189,90,198,94,198,105,189,109,180,105,180,94' onclick='clickColor("#FF00FF",-110,180)' onmouseover='mouseOverColor("#FF00FF")' alt='#FF00FF' />
		<area style='cursor:pointer' shape='poly' coords='207,90,216,94,216,105,207,109,198,105,198,94' onclick='clickColor("#CC00CC",-110,198)' onmouseover='mouseOverColor("#CC00CC")' alt='#CC00CC' />
		<area style='cursor:pointer' shape='poly' coords='225,90,234,94,234,105,225,109,216,105,216,94' onclick='clickColor("#660066",-110,216)' onmouseover='mouseOverColor("#660066")' alt='#660066' />
		<area style='cursor:pointer' shape='poly' coords='18,105,27,109,27,120,18,124,9,120,9,109' onclick='clickColor("#336600",-95,9)' onmouseover='mouseOverColor("#336600")' alt='#336600' />
		<area style='cursor:pointer' shape='poly' coords='36,105,45,109,45,120,36,124,27,120,27,109' onclick='clickColor("#009900",-95,27)' onmouseover='mouseOverColor("#009900")' alt='#009900' />
		<area style='cursor:pointer' shape='poly' coords='54,105,63,109,63,120,54,124,45,120,45,109' onclick='clickColor("#66FF33",-95,45)' onmouseover='mouseOverColor("#66FF33")' alt='#66FF33' />
		<area style='cursor:pointer' shape='poly' coords='72,105,81,109,81,120,72,124,63,120,63,109' onclick='clickColor("#99FF66",-95,63)' onmouseover='mouseOverColor("#99FF66")' alt='#99FF66' />
		<area style='cursor:pointer' shape='poly' coords='90,105,99,109,99,120,90,124,81,120,81,109' onclick='clickColor("#CCFF99",-95,81)' onmouseover='mouseOverColor("#CCFF99")' alt='#CCFF99' />
		<area style='cursor:pointer' shape='poly' coords='108,105,117,109,117,120,108,124,99,120,99,109' onclick='clickColor("#FFFFCC",-95,99)' onmouseover='mouseOverColor("#FFFFCC")' alt='#FFFFCC' />
		<area style='cursor:pointer' shape='poly' coords='126,105,135,109,135,120,126,124,117,120,117,109' onclick='clickColor("#FFCCCC",-95,117)' onmouseover='mouseOverColor("#FFCCCC")' alt='#FFCCCC' />
		<area style='cursor:pointer' shape='poly' coords='144,105,153,109,153,120,144,124,135,120,135,109' onclick='clickColor("#FF99CC",-95,135)' onmouseover='mouseOverColor("#FF99CC")' alt='#FF99CC' />
		<area style='cursor:pointer' shape='poly' coords='162,105,171,109,171,120,162,124,153,120,153,109' onclick='clickColor("#FF66CC",-95,153)' onmouseover='mouseOverColor("#FF66CC")' alt='#FF66CC' />
		<area style='cursor:pointer' shape='poly' coords='180,105,189,109,189,120,180,124,171,120,171,109' onclick='clickColor("#FF33CC",-95,171)' onmouseover='mouseOverColor("#FF33CC")' alt='#FF33CC' />
		<area style='cursor:pointer' shape='poly' coords='198,105,207,109,207,120,198,124,189,120,189,109' onclick='clickColor("#CC0099",-95,189)' onmouseover='mouseOverColor("#CC0099")' alt='#CC0099' />
		<area style='cursor:pointer' shape='poly' coords='216,105,225,109,225,120,216,124,207,120,207,109' onclick='clickColor("#993399",-95,207)' onmouseover='mouseOverColor("#993399")' alt='#993399' />
		<area style='cursor:pointer' shape='poly' coords='27,120,36,124,36,135,27,139,18,135,18,124' onclick='clickColor("#333300",-80,18)' onmouseover='mouseOverColor("#333300")' alt='#333300' />
		<area style='cursor:pointer' shape='poly' coords='45,120,54,124,54,135,45,139,36,135,36,124' onclick='clickColor("#669900",-80,36)' onmouseover='mouseOverColor("#669900")' alt='#669900' />
		<area style='cursor:pointer' shape='poly' coords='63,120,72,124,72,135,63,139,54,135,54,124' onclick='clickColor("#99FF33",-80,54)' onmouseover='mouseOverColor("#99FF33")' alt='#99FF33' />
		<area style='cursor:pointer' shape='poly' coords='81,120,90,124,90,135,81,139,72,135,72,124' onclick='clickColor("#CCFF66",-80,72)' onmouseover='mouseOverColor("#CCFF66")' alt='#CCFF66' />
		<area style='cursor:pointer' shape='poly' coords='99,120,108,124,108,135,99,139,90,135,90,124' onclick='clickColor("#FFFF99",-80,90)' onmouseover='mouseOverColor("#FFFF99")' alt='#FFFF99' />
		<area style='cursor:pointer' shape='poly' coords='117,120,126,124,126,135,117,139,108,135,108,124' onclick='clickColor("#FFCC99",-80,108)' onmouseover='mouseOverColor("#FFCC99")' alt='#FFCC99' />
		<area style='cursor:pointer' shape='poly' coords='135,120,144,124,144,135,135,139,126,135,126,124' onclick='clickColor("#FF9999",-80,126)' onmouseover='mouseOverColor("#FF9999")' alt='#FF9999' />
		<area style='cursor:pointer' shape='poly' coords='153,120,162,124,162,135,153,139,144,135,144,124' onclick='clickColor("#FF6699",-80,144)' onmouseover='mouseOverColor("#FF6699")' alt='#FF6699' />
		<area style='cursor:pointer' shape='poly' coords='171,120,180,124,180,135,171,139,162,135,162,124' onclick='clickColor("#FF3399",-80,162)' onmouseover='mouseOverColor("#FF3399")' alt='#FF3399' />
		<area style='cursor:pointer' shape='poly' coords='189,120,198,124,198,135,189,139,180,135,180,124' onclick='clickColor("#CC3399",-80,180)' onmouseover='mouseOverColor("#CC3399")' alt='#CC3399' />
		<area style='cursor:pointer' shape='poly' coords='207,120,216,124,216,135,207,139,198,135,198,124' onclick='clickColor("#990099",-80,198)' onmouseover='mouseOverColor("#990099")' alt='#990099' />
		<area style='cursor:pointer' shape='poly' coords='36,135,45,139,45,150,36,154,27,150,27,139' onclick='clickColor("#666633",-65,27)' onmouseover='mouseOverColor("#666633")' alt='#666633' />
		<area style='cursor:pointer' shape='poly' coords='54,135,63,139,63,150,54,154,45,150,45,139' onclick='clickColor("#99CC00",-65,45)' onmouseover='mouseOverColor("#99CC00")' alt='#99CC00' />
		<area style='cursor:pointer' shape='poly' coords='72,135,81,139,81,150,72,154,63,150,63,139' onclick='clickColor("#CCFF33",-65,63)' onmouseover='mouseOverColor("#CCFF33")' alt='#CCFF33' />
		<area style='cursor:pointer' shape='poly' coords='90,135,99,139,99,150,90,154,81,150,81,139' onclick='clickColor("#FFFF66",-65,81)' onmouseover='mouseOverColor("#FFFF66")' alt='#FFFF66' />
		<area style='cursor:pointer' shape='poly' coords='108,135,117,139,117,150,108,154,99,150,99,139' onclick='clickColor("#FFCC66",-65,99)' onmouseover='mouseOverColor("#FFCC66")' alt='#FFCC66' />
		<area style='cursor:pointer' shape='poly' coords='126,135,135,139,135,150,126,154,117,150,117,139' onclick='clickColor("#FF9966",-65,117)' onmouseover='mouseOverColor("#FF9966")' alt='#FF9966' />
		<area style='cursor:pointer' shape='poly' coords='144,135,153,139,153,150,144,154,135,150,135,139' onclick='clickColor("#FF6666",-65,135)' onmouseover='mouseOverColor("#FF6666")' alt='#FF6666' />
		<area style='cursor:pointer' shape='poly' coords='162,135,171,139,171,150,162,154,153,150,153,139' onclick='clickColor("#FF0066",-65,153)' onmouseover='mouseOverColor("#FF0066")' alt='#FF0066' />
		<area style='cursor:pointer' shape='poly' coords='180,135,189,139,189,150,180,154,171,150,171,139' onclick='clickColor("#CC6699",-65,171)' onmouseover='mouseOverColor("#CC6699")' alt='#CC6699' />
		<area style='cursor:pointer' shape='poly' coords='198,135,207,139,207,150,198,154,189,150,189,139' onclick='clickColor("#993366",-65,189)' onmouseover='mouseOverColor("#993366")' alt='#993366' />
		<area style='cursor:pointer' shape='poly' coords='45,150,54,154,54,165,45,169,36,165,36,154' onclick='clickColor("#999966",-50,36)' onmouseover='mouseOverColor("#999966")' alt='#999966' />
		<area style='cursor:pointer' shape='poly' coords='63,150,72,154,72,165,63,169,54,165,54,154' onclick='clickColor("#CCCC00",-50,54)' onmouseover='mouseOverColor("#CCCC00")' alt='#CCCC00' />
		<area style='cursor:pointer' shape='poly' coords='81,150,90,154,90,165,81,169,72,165,72,154' onclick='clickColor("#FFFF00",-50,72)' onmouseover='mouseOverColor("#FFFF00")' alt='#FFFF00' />
		<area style='cursor:pointer' shape='poly' coords='99,150,108,154,108,165,99,169,90,165,90,154' onclick='clickColor("#FFCC00",-50,90)' onmouseover='mouseOverColor("#FFCC00")' alt='#FFCC00' />
		<area style='cursor:pointer' shape='poly' coords='117,150,126,154,126,165,117,169,108,165,108,154' onclick='clickColor("#FF9933",-50,108)' onmouseover='mouseOverColor("#FF9933")' alt='#FF9933' />
		<area style='cursor:pointer' shape='poly' coords='135,150,144,154,144,165,135,169,126,165,126,154' onclick='clickColor("#FF6600",-50,126)' onmouseover='mouseOverColor("#FF6600")' alt='#FF6600' />
		<area style='cursor:pointer' shape='poly' coords='153,150,162,154,162,165,153,169,144,165,144,154' onclick='clickColor("#FF5050",-50,144)' onmouseover='mouseOverColor("#FF5050")' alt='#FF5050' />
		<area style='cursor:pointer' shape='poly' coords='171,150,180,154,180,165,171,169,162,165,162,154' onclick='clickColor("#CC0066",-50,162)' onmouseover='mouseOverColor("#CC0066")' alt='#CC0066' />
		<area style='cursor:pointer' shape='poly' coords='189,150,198,154,198,165,189,169,180,165,180,154' onclick='clickColor("#660033",-50,180)' onmouseover='mouseOverColor("#660033")' alt='#660033' />
		<area style='cursor:pointer' shape='poly' coords='54,165,63,169,63,180,54,184,45,180,45,169' onclick='clickColor("#996633",-35,45)' onmouseover='mouseOverColor("#996633")' alt='#996633' />
		<area style='cursor:pointer' shape='poly' coords='72,165,81,169,81,180,72,184,63,180,63,169' onclick='clickColor("#CC9900",-35,63)' onmouseover='mouseOverColor("#CC9900")' alt='#CC9900' />
		<area style='cursor:pointer' shape='poly' coords='90,165,99,169,99,180,90,184,81,180,81,169' onclick='clickColor("#FF9900",-35,81)' onmouseover='mouseOverColor("#FF9900")' alt='#FF9900' />
		<area style='cursor:pointer' shape='poly' coords='108,165,117,169,117,180,108,184,99,180,99,169' onclick='clickColor("#CC6600",-35,99)' onmouseover='mouseOverColor("#CC6600")' alt='#CC6600' />
		<area style='cursor:pointer' shape='poly' coords='126,165,135,169,135,180,126,184,117,180,117,169' onclick='clickColor("#FF3300",-35,117)' onmouseover='mouseOverColor("#FF3300")' alt='#FF3300' />
		<area style='cursor:pointer' shape='poly' coords='144,165,153,169,153,180,144,184,135,180,135,169' onclick='clickColor("#FF0000",-35,135)' onmouseover='mouseOverColor("#FF0000")' alt='#FF0000' />
		<area style='cursor:pointer' shape='poly' coords='162,165,171,169,171,180,162,184,153,180,153,169' onclick='clickColor("#CC0000",-35,153)' onmouseover='mouseOverColor("#CC0000")' alt='#CC0000' />
		<area style='cursor:pointer' shape='poly' coords='180,165,189,169,189,180,180,184,171,180,171,169' onclick='clickColor("#990033",-35,171)' onmouseover='mouseOverColor("#990033")' alt='#990033' />
		<area style='cursor:pointer' shape='poly' coords='63,180,72,184,72,195,63,199,54,195,54,184' onclick='clickColor("#663300",-20,54)' onmouseover='mouseOverColor("#663300")' alt='#663300' />
		<area style='cursor:pointer' shape='poly' coords='81,180,90,184,90,195,81,199,72,195,72,184' onclick='clickColor("#996600",-20,72)' onmouseover='mouseOverColor("#996600")' alt='#996600' />
		<area style='cursor:pointer' shape='poly' coords='99,180,108,184,108,195,99,199,90,195,90,184' onclick='clickColor("#CC3300",-20,90)' onmouseover='mouseOverColor("#CC3300")' alt='#CC3300' />
		<area style='cursor:pointer' shape='poly' coords='117,180,126,184,126,195,117,199,108,195,108,184' onclick='clickColor("#993300",-20,108)' onmouseover='mouseOverColor("#993300")' alt='#993300' />
		<area style='cursor:pointer' shape='poly' coords='135,180,144,184,144,195,135,199,126,195,126,184' onclick='clickColor("#990000",-20,126)' onmouseover='mouseOverColor("#990000")' alt='#990000' />
		<area style='cursor:pointer' shape='poly' coords='153,180,162,184,162,195,153,199,144,195,144,184' onclick='clickColor("#800000",-20,144)' onmouseover='mouseOverColor("#800000")' alt='#800000' />
		<area style='cursor:pointer' shape='poly' coords='171,180,180,184,180,195,171,199,162,195,162,184' onclick='clickColor("#993333",-20,162)' onmouseover='mouseOverColor("#993333")' alt='#993333' />
	 `;
	return html;
}

async function mColorPicker(dParent) {
	let d = mDom(dParent,{bg:'black'});
	let img = await imgAsync(d, {}, { src: '../copi2/img_colormap.gif', usemap: '#colormap' });
	mStyle(d,{w:img.naturalWidth,h:img.naturalHeight});
	mAppend(d, colormapHtml());
	let dSelectHex = mDom(d, { visibility: 'hidden', position: 'relative', w: 21, h: 21, bgImage: 'url("../copi2/img_selectedcolor.gif")' }, { id: 'selectedhexagon' });
	console.log('rect', getRect(d));
	return {d,img,dSelectHex};
}














