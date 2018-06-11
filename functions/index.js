const functions = require("firebase-functions");
const cheerio = require("cheerio");
const moment = require("moment");

// https://github.com/firebase/functions-cron
exports.hourly_job = functions.pubsub.topic("hourly-tick").onPublish(event => {
  return this.processDisBoardsData();
});

// can't get to work with raw-loader
// import htmlData from "@/../data/4.2018-raw.html";

function processDisBoardsData() {
  console.log("Processing DisBoard Data!");
  let $ = getRawHtml();
  let epoch = parseEditDateFromHtml($);
  // if epoch is different
  let contracts = parseContractsFromHtml($);
  return saveContractsToFirebase(epoch, contracts);
}

function getRawHtml() {
  return cheerio.load(htmlData);
}

function parseEditDateFromHtml($) {
  // https://www.disboa......#post-59034110
  // id=post-59034110
  // div class=editDate class=DateTime data-time data-diff, epoch

  return $("#post-59034110 .editDate .DateTime").attr("data-time"); //"epoch";
}

function parseContractsFromHtml($) {
  // https://www.disboa......#post-59034110
  // id=post-59034110
  // div class=messageContent

  let html = $("#post-59034110 div.messageContent").html();
  let lines = html.split("<br>").map(l => cheerio.load(l).text());
  let contracts = lines
    .filter(l => l.indexOf("---") >= 0)
    .map(parseLine)
    .filter(l => l !== null);

  return contracts;
}

function parseLine(line) {
  // NewbieMom---$88-$14839-150-AKV-Apr-0/17, 150/18, 150/19, 150/20- sent 5/7
  // David K.---$102-$22356-200-AKV-Sep-0/17, 200/18, 200/19- sent 4/12, taken 5/8
  // David K.---$104-$24537-220-AKV-Mar-0/17, 152/18, 220/19-International seller- sent 5/14, passed 5/31

  let contract = {};
  let a = line.split("---");
  if (a.length !== 2) {
    //error state
    console.log("Error: " + line);
    return null;
  }
  contract.user = a[0];
  let props = a[1].split("-");
  if (props.length < 7 || props.length > 8) {
    //error state
    console.log("Error: " + line);
    return null;
  }
  contract.pricePerPoint = Number(props[0].substr(1)); //strip $
  contract.totalCost = Number(props[1].substr(1)); //strip $
  contract.points = Number(props[2]);
  contract.resort = props[3];
  contract.useYear = props[4];
  contract.availablePoints = props[5];
  contract.notes = props.length === 8 ? props[6] : null;
  let dateStr = props.length === 8 ? props[7] : props[6];
  let dates = dateStr.split(",");
  let dateSentStr = dates[0].replace("sent").trim();
  contract.dateSent = moment(dateSentStr, "MM/DD").format("YYYY-MM-DD");
  let status = "Waiting";
  let dateResolved = null;
  if (dates.length === 2) {
    status = dates[1].indexOf("taken") >= 0 ? "Taken" : "Passed";
    let dateResolvedStr = dates[1]
      .replace("taken")
      .replace("passed")
      .trim();
    dateResolved = moment(dateResolvedStr, "MM/DD").format("YYYY-MM-DD");
  }
  contract.status = status;
  contract.dateResolved = dateResolved;

  return contract;
}

function saveContractsToFirebase(epoch, contracts) {
  console.log("epoch: " + epoch + "\ncontracts: " + contracts.length);
  return true;
}

if (process.env.NODE_ENV === "test") {
  exports.processDisBoardsData = processDisBoardsData;
  exports.parseEditDateFromHtml = parseEditDateFromHtml;
  exports.parseContractsFromHtml = parseContractsFromHtml;
  exports.parseLine = parseLine;
}

let htmlData = `
<!DOCTYPE html>
<html id="XenForo" lang="en-US" dir="LTR" class="Public NoJs LoggedIn NoSidebar  Responsive" xmlns:fb="http://www.facebook.com/2008/fbml">

<head>

	'

	<!-- Google Tag Manager -->
	<script>(function (w, d, s, l, i) {
			w[l] = w[l] || []; w[l].push({
				'gtm.start':
					new Date().getTime(), event: 'gtm.js'
			}); var f = d.getElementsByTagName(s)[0],
				j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true; j.src =
					'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);
		})(window, document, 'script', 'dataLayer', 'GTM-PJXSRGC');</script>
	<!-- End Google Tag Manager -->



	<!-- OneTrust Cookies Consent Notice (Production CDN, www.disboards.com, en-GB) start -->

	<script src="https://cdn.cookielaw.org/consent/7179c6d9-9eab-4477-8d0d-7db15fcd8828.js" type="text/javascript" charset="UTF-8"></script>

	<script type="text/javascript">

		function OptanonWrapper() { }

	</script>

	<!-- OneTrust Cookies Consent Notice (Production CDN, www.disboards.com, en-GB) end -->


	<meta charset="utf-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" />

	<meta name="viewport" content="width=device-width, initial-scale=1" />


	<base href="https://www.disboards.com/" />
	<script>
		var _b = document.getElementsByTagName('base')[0], _bH = "https://www.disboards.com/";
		if (_b && _b.href != _bH) _b.href = _bH;
	</script>


	<title>ROFR Thread April to June 2018 *PLEASE SEE FIRST POST FOR INSTRUCTIONS &amp; FORMATTING TOOL* | The DIS Disney Discussion
		Forums - DISboards.com</title>

	<noscript>
		<style>
			.JsOnly,
			.jsOnly {
				display: none !important;
			}
		</style>
	</noscript>
	<link rel="stylesheet" href="css.php?css=xenforo,form,public&amp;style=5&amp;dir=LTR&amp;d=1528553077" />
	<link rel="stylesheet" href="css.php?css=attachment_editor,bb_code,editor_ui,likes_summary,message,message_user_info,notices,panel_scroller,quick_reply,share_page,thread_view,xengallery_tab_links&amp;style=5&amp;dir=LTR&amp;d=1528553077"
	/>


	<link href="//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">



	<script src="js/jquery/jquery-1.11.0.min.js"></script>

	<script src="js/xenforo/xenforo.js?_v=4d29ecb3"></script>
	<script>XenForo.node_name = 'Purchasing DVC (28)';</script>
	<script src="js/xenforo/discussion.js?_v=4d29ecb3"></script>
	<script src="js/redactor/redactor.js?_v=4d29ecb3"></script>
	<script src="js/xenforo/bb_code_edit.js?_v=4d29ecb3"></script>
	<script src="js/xenforo/attachment_editor_new.js?_v=4d29ecb3"></script>
	<script src="js/flow.js/flow-rollup.min.js?_v=4d29ecb3"></script>

	<script>
		$(document).ready(function () {
			(function (i, s, o, g, r, a, m) { i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () { (i[r].q = i[r].q || []).push(arguments) }, i[r].l = 1 * new Date(); a = s.createElement(o), m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m) })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga'); ga("create", "", "auto"); ga("require", "displayfeatures"); ga('set', 'forceSSL', true);
			if (XenForo.visitor.user_id > 0) { ga('set', '&uid', XenForo.visitor.user_id); ga('set', 'dimension2', XenForo.visitor.user_id); }
			if (typeof XenForo.node_name != 'undefined') { ga('set', 'dimension1', XenForo.node_name); }
			if ("/account/upgrades" == document.location.pathname.substr(-17)) {
				ga("require", "ec"); var position = 1; $("form.upgradeForm").each(function () {
					$(this).find('input[type="submit"]').on("click", function () { var name = $(this).closest("form").find('input[name="item_name"]').val().match(/^.*?: (.*) \(/)[1]; ga("ec:addProduct", { id: "UU-" + $(this).closest("form").find('input[name="custom"]').val().match(/^.*?,(.*?),/)[1], name: name, category: "User Upgrades" }); ga("ec:setAction", "checkout"); ga("send", "event", "Checkout", "Click", name) });
					ga("ec:addImpression", { id: "UU-" + $(this).find('input[name="custom"]').val().match(/^.*?,(.*?),/)[1], name: $(this).find('input[name="item_name"]').val().match(/^.*?: (.*) \(/)[1], category: "User Upgrades", list: "User Upgrade List", position: position++ })
				})
			};
			if (document.referrer.match(/paypal\.com.*?cgi-bin\/webscr|facebook\.com.*?dialog\/oauth|twitter\.com\/oauth|google\.com.*?\/oauth2/) != null) { ga('set', 'referrer', ''); }
			ga("send", "pageview");
			setTimeout("ga('send','event','User','Engagement','Time on page more than 15 seconds')", 15000);




			setTimeout(function () {
				try {
					FB.Event.subscribe("edge.create", function (a) { ga("send", "social", "Facebook", "Like", a) }), FB.Event.subscribe("edge.remove", function (a) { ga("send", "social", "Facebook", "Unlike", a) }), twttr.ready(function (a) {
						a.events.bind("tweet", function (b) { if (b) { var a; b.target && "IFRAME" == b.target.nodeName && (a = ePFU(b.target.src, "url")); ga("send", "social", "Twitter", "Tweet", a) } }); a.events.bind("follow", function (b) {
							if (b) {
								var a; b.target && "IFRAME" == b.target.nodeName && (a =
									ePFU(b.target.src, "url")); ga("send", "social", "Twitter", "Follow", a)
							}
						})
					})
				} catch (c) { }
			}, 1E3);
		});
		function ePFU(c, a) { if (c) { c = c.split("#")[0]; var b = c.split("?"); if (1 != b.length) { b = decodeURI(b[1]); a += "="; for (var b = b.split("&"), e = 0, d; d = b[e]; ++e)if (0 === d.indexOf(a)) return unescape(d.split("=")[1]) } } }
	</script>


	<link rel="apple-touch-icon" href="https://images.wdwinfo.com/logos/home-disboards-iphone-114.gif" />

	<link rel="alternate" type="application/rss+xml" title="RSS feed for The DIS Disney Discussion Forums - DISboards.com" href="forums/-/index.rss"
	/>

	<link rel="next" href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/page-2"
	/>
	<link rel="canonical" href="https://www.disboards.com/threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/"
	/>
	<meta name="description" content="Hi everyone!


This thread can be an invaluable tool for buyers looking for some help when researching the most up-to-date prices for DVC contracts on..."
	/>
	<meta property="og:site_name" content="The DIS Disney Discussion Forums - DISboards.com" />
	<meta property="og:image" content="https://www.disboards.com/data/avatars/m/524/524969.jpg?1483134808" />
	<meta property="og:image" content="https://www.disboards.com/styles/default/xenforo/logo.og.png" />
	<meta property="og:type" content="article" />
	<meta property="og:url" content="https://www.disboards.com/threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/"
	/>
	<meta property="og:title" content="ROFR Thread April to June 2018 *PLEASE SEE FIRST POST FOR INSTRUCTIONS &amp; FORMATTING TOOL*"
	/>
	<meta property="og:description" content="Hi everyone!


This thread can be an invaluable tool for buyers looking for some help when researching the most up-to-date prices for DVC contracts on..."
	/>

	<meta property="fb:app_id" content="121096628388" />



	<LINK REL="SHORTCUT ICON" HREF="https://www.wdwinfo.com/favicon.ico">
	<meta name="google-site-verification" content="LWSTDZ0qWQB4VFSO7m8WP2E5w5EKiFzznKVvqUx7eRA" />

</head>

<script type="text/javascript">
	var vglnk = { key: 'debb21522a2ba14b8d7bcbd1910c5bdb' };

	(function (d, t) {
		var s = d.createElement(t); s.type = 'text/javascript'; s.async = true;
		s.src = '//cdn.viglink.com/api/vglnk.js';
		var r = d.getElementsByTagName(t)[0]; r.parentNode.insertBefore(s, r);
	}(document, 'script'));
</script>

<body class="node28 node7 node200 SelectQuotable">




	<div id="headerMover">
		<div id="headerProxy"></div>

		<div id="content" class="thread_view">
			<div class="pageWidth">
				<div class="pageContent">
					<!-- main content area -->









					<!-- Google Tag Manager (noscript) -->
					<noscript>
						<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PJXSRGC" height="0" width="0" style="display:none;visibility:hidden"></iframe>
					</noscript>
					<!-- End Google Tag Manager (noscript) -->

					<script type='text/javascript'>
						var googletag = googletag || {};
						googletag.cmd = googletag.cmd || [];
						(function () {
							var gads = document.createElement('script');
							gads.async = true;
							gads.type = 'text/javascript';
							var useSSL = 'https:' == document.location.protocol;
							gads.src = (useSSL ? 'https:' : 'http:') +
								'//www.googletagservices.com/tag/js/gpt.js';
							var node = document.getElementsByTagName('script')[0];
							node.parentNode.insertBefore(gads, node);
						})();
					</script>

					<script type='text/javascript'>

< !--
							googletag.cmd.push(function () {

								googletag.defineSlot('/1007433/disboards_body_300', ['fluid', [300, 250]], 'div-gpt-ad-1507482887161-0').addService(googletag.pubads());
								googletag.defineSlot('/1007433/disboards_top_right_header', [728, 90], 'div-gpt-ad-1502208938629-0').addService(googletag.pubads());
								googletag.defineSlot('/1007433/disboards_bottom_center_300', [300, 250], 'div-gpt-ad-1507597326922-0').addService(googletag.pubads());
								googletag.defineSlot('/1007433/disboards_mobile_top', [[320, 50], [320, 100], 'fluid'], 'div-gpt-ad-1497483587083-0').addService(googletag.pubads());
								googletag.defineSlot('/1007433/disboards_top', [728, 90], 'div-gpt-ad-1506351112462-0').addService(googletag.pubads());
								googletag.defineSlot('/1007433/disboards_bottom_left', [300, 250], 'div-gpt-ad-1507597619529-0').addService(googletag.pubads());
								googletag.defineSlot('/1007433/disboards_bottom_right', [300, 250], 'div-gpt-ad-1507597919976-0').addService(googletag.pubads());
















								googletag.defineSlot('/1007433/disboards_body_dvc_forum_300', [300, 250], 'div-gpt-ad-1422459539922-0').addService(googletag.pubads());
								googletag.defineSlot('/1007433/disboards_top_dvc', [728, 90], 'div-gpt-ad-1507480862106-0').addService(googletag.pubads());
								googletag.defineSlot('/1007433/disboards_top_dvc_rent', [728, 90], 'div-gpt-ad-1423080959853-0').addService(googletag.pubads());






								googletag.pubads().enableSingleRequest();
								googletag.enableServices();
							});

//-->
					</script>


					<!--BEGIN TOP ADS  -->
					<div align="center">
						<br>
						<br>
						<br>

						<span class="mobilehide">
							<!-- /1007433/disboards_top_dvc -->
							<div id='div-gpt-ad-1507480862106-0' style='height:90px; width:728px;'>
								<script>
									googletag.cmd.push(function () { googletag.display('div-gpt-ad-1507480862106-0'); });
								</script>
							</div>
						</span>
						<span class="mobileshow">
							<a href="http://www.dvcstore.com/sellers.htm">
								<img src="https://tpc.googlesyndication.com/pagead/imgad?id=CICAgKCzt8ikQRDYBRhaKAEyCNneaalw7rFJ" width="100%">
							</a>
						</span>


						<!--DVC RENT-->






					</div>
					<!--END TOP ADS-->





					<div class="breadBoxTop ">



						<nav>
















							<fieldset class="breadcrumb">
								<a href="misc/quick-navigation-menu?selected=node-28" class="OverlayTrigger jumpMenuTrigger" data-cacheOverlay="true" title="Open quick navigation">
									<!--Jump to...-->
								</a>

								<div class="boardTitle">
									<strong>The DIS Disney Discussion Forums - DISboards.com</strong>
								</div>

								<span class="crumbs">

									<span class="crust homeCrumb" itemscope="itemscope" itemtype="http://data-vocabulary.org/Breadcrumb">
										<a href="https://www.disboards.com" class="crumb" rel="up" itemprop="url">
											<span itemprop="title">Home</span>
										</a>
										<span class="arrow">
											<span></span>
										</span>
									</span>



									<span class="crust selectedTabCrumb" itemscope="itemscope" itemtype="http://data-vocabulary.org/Breadcrumb">
										<a href="https://www.disboards.com/" class="crumb" rel="up" itemprop="url">
											<span itemprop="title">Forums</span>
										</a>
										<span class="arrow">
											<span>&gt;</span>
										</span>
									</span>




									<span class="crust" itemscope="itemscope" itemtype="http://data-vocabulary.org/Breadcrumb">
										<a href="https://www.disboards.com/#disney-vacation-club.7" class="crumb" rel="up" itemprop="url">
											<span itemprop="title">Disney Vacation Club</span>
										</a>
										<span class="arrow">
											<span>&gt;</span>
										</span>
									</span>

									<span class="crust" itemscope="itemscope" itemtype="http://data-vocabulary.org/Breadcrumb">
										<a href="https://www.disboards.com/forums/disney-vacation-club-forums.200/" class="crumb" rel="up" itemprop="url">
											<span itemprop="title">Disney Vacation Club Forums</span>
										</a>
										<span class="arrow">
											<span>&gt;</span>
										</span>
									</span>

									<span class="crust" itemscope="itemscope" itemtype="http://data-vocabulary.org/Breadcrumb">
										<a href="https://www.disboards.com/forums/purchasing-dvc.28/" class="crumb" rel="up" itemprop="url">
											<span itemprop="title">Purchasing DVC</span>
										</a>
										<span class="arrow">
											<span>&gt;</span>
										</span>
									</span>


								</span>
							</fieldset>
						</nav>
					</div>





					<!-- Announcement  
<div align="center" style="background-color:#E7003D; padding: 10px "><strong><a href="http://www.wdwinfo.com/news-stories/walt-disney-world-free-dining-promotion-announced-for-2018/"  style="text-decoration: none; color: rgba(248,248,248,1);" target="blank" >Walt Disney World Free Dining Promotion Announced for 2018</a></strong>
   </div>

 Announcement  -->

					<div style="clear: both;"></div>




					<!--[if lt IE 8]>
							<p class="importantMessage">You are using an out of date browser. It  may not display this or other websites correctly.<br />You should upgrade or use an <a href="https://www.google.com/chrome/browser/" target="_blank">alternative browser</a>.</p>
						<![endif]-->








					<div class="PanelScroller Notices" data-vertical="0" data-speed="400" data-interval="4000">
						<div class="scrollContainer">
							<div class="PanelContainer">
								<ol class="Panels">

									<li class="panel Notice DismissParent notice_70 " data-notice="70">

										<div class="baseHtml noticeContent">
											<a href="http://www.wdwinfo.com/news-stories/2019-walt-disney-world-vacation-packages-can-be-booked-on-june-19/" target="blank">2019 Walt Disney World Vacation Packages Can Be Booked on June 19</a>
										</div>


										<a href="account/dismiss-notice?notice_id=70" title="Dismiss Notice" class="DismissCtrl Tooltip" data-offsetx="7" data-tipclass="flipped">Dismiss Notice</a>
									</li>

								</ol>
							</div>
						</div>


					</div>








					<!-- h1 title, description -->
					<div class="titleBar">

						<h1>ROFR Thread April to June 2018 *PLEASE SEE FIRST POST FOR INSTRUCTIONS &amp; FORMATTING TOOL*</h1>

						<p id="pageDescription" class="muted ">
							Discussion in '
							<a href="forums/purchasing-dvc.28/">Purchasing DVC</a>' started by
							<a href="members/pangyal.524969/" class="username" dir="auto">pangyal</a>,
							<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/">
								<span class="DateTime" title="Apr 3, 2018 at 12:50 PM">Apr 3, 2018</span>
							</a>.
						</p>
					</div>





					<!-- main template -->

































					<div class="pageNavLinkGroup">
						<div class="linkGroup SelectionCountContainer">


							<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/watch-confirm"
							 class="OverlayTrigger" data-cacheOverlay="false">Unwatch Thread</a>

						</div>




						<div class="PageNav" data-page="1" data-range="2" data-start="2" data-end="6" data-last="104" data-sentinel="{{sentinel}}"
						 data-baseurl="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/page-{{sentinel}}">

							<span class="pageNavHeader">Page 1 of 104</span>

							<nav>


								<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/" class="currentPage "
								 rel="start">1</a>


								<a class="PageNavPrev hidden">&larr;</a>
								<span class="scrollable">
									<span class="items">



										<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/page-2" class="">2</a>

										<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/page-3" class="">3</a>

										<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/page-4" class="">4</a>

										<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/page-5" class="">5</a>

										<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/page-6" class="">6</a>



									</span>
								</span>
								<a class="PageNavNext ">&rarr;</a>


								<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/page-104"
								 class="">104</a>


								<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/page-2" class="text">Next &gt;</a>


							</nav>


							<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/unread" class="text distinct unreadLink">Go to First Unread</a>

						</div>

					</div>






					<form action="inline-mod/post/switch" method="post" class="InlineModForm section" data-cookieName="posts" data-controls="#InlineModControls"
					 data-imodOptions="#ModerationSelect option">

						<ol class="messageList" id="messageList">





							<li id="post-59034103" class="message   " data-author="pangyal">



								<div class="messageUserInfo" itemscope="itemscope" itemtype="http://data-vocabulary.org/Person">
									<div class="messageUserBlock ">

										<div class="avatarHolder">
											<span class="helper"></span>
											<a href="members/pangyal.524969/" class="avatar Av524969m" data-avatarhtml="true">
												<img src="data/avatars/m/524/524969.jpg?1483134808" width="96" height="96" alt="pangyal" />
											</a>

											<!-- slot: message_user_info_avatar -->
										</div>




										<h3 class="userText">
											<a href="members/pangyal.524969/" class="username" dir="auto" itemprop="name">pangyal</a>
											<em class="userTitle" itemprop="title">#TeamSven</em>

											<!-- slot: message_user_info_text -->
										</h3>



										<div class="extraUserInfo">



											<dl class="pairsJustified">
												<dt>Joined:</dt>
												<dd>Jul 26, 2014</dd>
											</dl>



											<dl class="pairsJustified">
												<dt>Messages:</dt>
												<dd>
													<a href="search/member?user_id=524969" class="concealed" rel="nofollow">3,614</a>
												</dd>
											</dl>

















										</div>




										<span class="arrow">
											<span></span>
										</span>
									</div>
								</div>

								<div class="messageInfo primaryContent">





									<div class="messageContent">
										<article>
											<blockquote class="messageText SelectQuoteContainer ugc baseHtml">

												Hi everyone!
												<br />
												<br />
												<br /> This thread can be an invaluable tool for buyers looking for some help when researching the most up-to-date
												prices for DVC contracts on the resale market, so I encourage everyone to post their contracts when they are
												sent to Disney, no matter if they are big, small, or in-between
												<img src="http://www.wdwinfo.com/images/smilies/smile.gif" class="mceSmilie" alt=":)" title="smile    :)" />!
												<br />
												<br />
												<b>If you would like me to post your details, PLEASE USE THE FOLLOWING LINK TO GENERATE YOUR DATA STRING OR I CANNOT
													ADD YOU (yes, I am being totally mean this round!):
													<br />
												</b>
												<br />
												<a href="https://rofr.scubacat.net/" target="_blank" class="externalLink" rel="nofollow">
													<b>
														<span style="font-size: 22px">https://rofr.scubacat.net</span>
													</b>
												</a>
												<br />
												<b>
													<br /> Just plug in all of the relevant data and post the resulting string in its entirety.</b>
												<br />
												<br /> If you would like to double-check your entries after using the tool, just know that I need your username at
												the front and all data in the following order:
												<br />
												<br /> DISname---Price per point-Total cost (Price per point x # of points + Maintenance Fees to be paid at closing
												+ Closing fees)-# of points-Home resort-Use Year-# of points available first year (banked or not),# of points
												current year, # of points following year, and year after that, followed by Date Sent for ROFR.
												<br />
												<br />
												<br /> Please include any other details such as whether the seller is splitting closing or paying current year&#039;s
												MFs. We assume that the buyer pays current year MF and closing, so no need to add those details in writing, only
												to the total amount.
												<br />
												<br /> Then come back and post whether you passed or not
												<b>using the tool again so that your completed string looks like the sample below</b>. Or I will chase you down!
												Just kidding. But, in the spirit of helping everyone who uses this thread as a resource, please do let us know
												whether or not Disney waived your contract so that the data is complete. Please do not simply post that you passed,
												as I cannot comb through the thread to find your contract.
												<br />
												<br />
												<br /> Sample:
												<a href="https://www.disboards.com/threads/rofr-thread-july-sept-2017-please-see-first-post-for-instructions-formatting-tool.3615204/"
												 class="internalLink">https://www.disboards.com/threads/r...ost-for-instructions-formatting-tool.3615204/</a>
												<br />
												<br /> pangyal---$144-$33296-219-VGF-Aug-113/14, 219/15, 219/16, 219/17- sent 8/24, passed 9/16
												<br />
												<br />
												<b>Please note that I cannot add you if you are missing any of the above details or if your contract has not yet
													been sent.
													<br />
													<br /> Here is a link to old ROFR list threads:
													<br />
													<br /> J
													<a href="http://www.disboards.com/threads/anyone-made-it-through-or-not-made-it-through-rofr-recently-section-v.3001288/"
													 class="internalLink">anuary 2013 - June 2013 at the bottom of page 161</a>
													<br />
													<a href="http://www.disboards.com/threads/new-rofr-list-post-your-details-here-after-reading-1st-post.3138652/" class="internalLink">July 2013- December 2013 ROFR List</a>
													<br />
													<a href="http://www.disboards.com/threads/rofr-thread-2014-jan-june-update-to-thread-on-pg-71.3232755/" class="internalLink">January 2014-June 2014 ROFR List</a>
													<br />
													<a href="http://www.disboards.com/showthread.php?t=3297614" class="internalLink">July 2014-December 2015 ROFR List</a>
													<br />
													<a href="http://www.disboards.com/threads/rofr-thread-2015-january-june-please-read-1st-post-for-instructions.3364441/" class="internalLink">January 2015 - July 2015 ROFR List</a>
													<br />
													<a href="http://www.disboards.com/threads/rofr-thread-september-december-2015-please-see-first-post-for-instructions.3448024/#post-54431384"
													 class="internalLink">September 2015- December 2015 ROFR List</a>
													<br />
													<a href="http://www.disboards.com/threads/rofr-thread-january-to-march-2016-please-see-first-post-for-instructions.3472360/"
													 class="internalLink">January 2016- March 2016 ROFR List</a>
													<br />
													<a href="http://www.disboards.com/threads/rofr-thread-april-to-june-2016-please-see-first-post-for-instructions-formatting-tool.3497913/"
													 class="internalLink">April 2016- June 2016 ROFR List</a>
													<br />
													<a href="http://www.disboards.com/threads/rofr-thread-july-to-sept-2016-please-see-first-post-for-instructions-formatting-tool.3523596/"
													 class="internalLink">July 2016- September 2016 ROFR List</a>
													<br />
													<a href="http://www.disboards.com/threads/rofr-thread-oct-dec-2016-please-see-first-post-for-instructions-formatting-tool.3551378/"
													 class="internalLink">October 2016- December 2016 ROFR List</a>
													<br />
													<a href="https://www.disboards.com/threads/rofr-thread-january-march-2017-please-see-first-post-for-instructions-formatting-tool.3568151/"
													 class="internalLink">January 2017- March 2017 ROFR List</a>
													<br />
													<a href="https://www.disboards.com/threads/rofr-thread-april-june-2017-please-see-first-post-for-instructions-formatting-tool.3594984/"
													 class="internalLink">April 2017- June 2017 ROFR List</a>
													<br />
													<a href="https://www.disboards.com/threads/rofr-thread-july-sept-2017-please-see-first-post-for-instructions-formatting-tool.3615204/"
													 class="internalLink">July 2017- Sept 2017 ROFR List</a>
													<br />
													<a href="https://www.disboards.com/threads/rofr-thread-oct-to-dec-2017-please-see-first-post-for-instructions-formatting-tool.3640575/"
													 class="internalLink">October 2017- December 2017 ROFR List</a>
													<br />
													<a href="https://www.disboards.com/threads/rofr-thread-january-to-march-2018-please-see-first-post-for-instructions-formatting-tool.3655341/"
													 class="internalLink">January 2018- March 2018 ROFR List</a>
												</b>
												<div class="messageTextEndMarker">&nbsp;</div>
											</blockquote>
										</article>


									</div>








									<div class="messageMeta ToggleTriggerAnchor">

										<div class="privateControls">

											<span class="item muted">
												<span class="authorEnd">
													<a href="members/pangyal.524969/" class="username author" dir="auto">pangyal</a>,</span>
												<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/" title="Permalink"
												 class="datePermalink">
													<span class="DateTime" title="Apr 3, 2018 at 12:50 PM">Apr 3, 2018</span>
												</a>
											</span>









											<a href="posts/59034103/report" class="OverlayTrigger item control report" data-cacheOverlay="false">
												<span></span>Report</a>



										</div>

										<div class="publicControls">
											<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/" title="Permalink"
											 class="item muted postNumber hashPermalink OverlayTrigger" data-href="posts/59034103/permalink">#1</a>


											<a href="posts/59034103/like" class="LikeLink item control like" data-container="#likes-post-59034103">
												<span></span>
												<span class="LikeLabel">Like</span>
											</a>


											<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/reply?quote=59034103"
											 data-messageid="59034103" class="MultiQuoteControl JsOnly item control" title="Toggle Multi-Quote">
												<span></span>
												<span class="symbol">+ Quote</span>
											</a>
											<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/reply?quote=59034103"
											 data-postUrl="posts/59034103/quote" data-tip="#MQ-59034103" class="ReplyQuote item control reply" title="Reply, quoting this message">
												<span></span>Reply</a>


										</div>
									</div>


									<div id="likes-post-59034103"></div>
								</div>




















							</li>






							<li id="post-59034107" class="message   " data-author="pangyal">



								<div class="messageUserInfo" itemscope="itemscope" itemtype="http://data-vocabulary.org/Person">
									<div class="messageUserBlock ">

										<div class="avatarHolder">
											<span class="helper"></span>
											<a href="members/pangyal.524969/" class="avatar Av524969m" data-avatarhtml="true">
												<img src="data/avatars/m/524/524969.jpg?1483134808" width="96" height="96" alt="pangyal" />
											</a>

											<!-- slot: message_user_info_avatar -->
										</div>




										<h3 class="userText">
											<a href="members/pangyal.524969/" class="username" dir="auto" itemprop="name">pangyal</a>
											<em class="userTitle" itemprop="title">#TeamSven</em>

											<!-- slot: message_user_info_text -->
										</h3>



										<div class="extraUserInfo">



											<dl class="pairsJustified">
												<dt>Joined:</dt>
												<dd>Jul 26, 2014</dd>
											</dl>



											<dl class="pairsJustified">
												<dt>Messages:</dt>
												<dd>
													<a href="search/member?user_id=524969" class="concealed" rel="nofollow">3,614</a>
												</dd>
											</dl>

















										</div>




										<span class="arrow">
											<span></span>
										</span>
									</div>
								</div>

								<div class="messageInfo primaryContent">





									<div class="messageContent">
										<article>
											<blockquote class="messageText SelectQuoteContainer ugc baseHtml">

												<b>
													<i>Please remember that your total price MUST include all closing costs, maintenance fees, and other fees that
														are a part of the total.</i>
													<br />
													<br /> Please make sure to use the nifty tool in Post One both to post your Sent and your Results!
													<br />
													<br />
													<span style="font-size: 18px">Please include the actual date your contract passed or was taken when you report your results. Writing that
														your contract passed &quot;today&quot; makes it tricky for me to update when I am doing so once per week
														<img src="http://www.wdwinfo.com/images/smilies/smile.gif" class="mceSmilie" alt=":)" title="smile    :)" />
													</span>
												</b>
												<div class="messageTextEndMarker">&nbsp;</div>
											</blockquote>
										</article>


									</div>








									<div class="messageMeta ToggleTriggerAnchor">

										<div class="privateControls">

											<span class="item muted">
												<span class="authorEnd">
													<a href="members/pangyal.524969/" class="username author" dir="auto">pangyal</a>,</span>
												<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/#post-59034107"
												 title="Permalink" class="datePermalink">
													<span class="DateTime" title="Apr 3, 2018 at 12:51 PM">Apr 3, 2018</span>
												</a>
											</span>









											<a href="posts/59034107/report" class="OverlayTrigger item control report" data-cacheOverlay="false">
												<span></span>Report</a>



										</div>

										<div class="publicControls">
											<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/#post-59034107"
											 title="Permalink" class="item muted postNumber hashPermalink OverlayTrigger" data-href="posts/59034107/permalink">#2</a>


											<a href="posts/59034107/like" class="LikeLink item control like" data-container="#likes-post-59034107">
												<span></span>
												<span class="LikeLabel">Like</span>
											</a>


											<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/reply?quote=59034107"
											 data-messageid="59034107" class="MultiQuoteControl JsOnly item control" title="Toggle Multi-Quote">
												<span></span>
												<span class="symbol">+ Quote</span>
											</a>
											<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/reply?quote=59034107"
											 data-postUrl="posts/59034107/quote" data-tip="#MQ-59034107" class="ReplyQuote item control reply" title="Reply, quoting this message">
												<span></span>Reply</a>


										</div>
									</div>


									<div id="likes-post-59034107"></div>
								</div>









								<li class="message">

									<span class="mobilehide">
										<div class="messageUserInfo">
											<div class="messageUserBlock">
												<div class="avatarHolder" style="height: 102px; width: 102px">
													<span class="helper"></span>
													<img src="http://images.wdwinfo.com/logos/dis.png" alt="Avatar" height="96px" width="96px" style="border: 1px solid #C0C0C0; padding: 2px"
													/>
												</div>


												<h3 class="userText">
													<span style="font-weight: bold">DIS Sponsor</span>
													<em class="userTitle" itemprop="title">Disney Vacation Club Resales www.dvcstore.com</em>
												</h3>



												<span class="arrow">
													<span>
													</span>
												</span>
											</div>
										</div>
									</span>


									<div class="messageInfoad primaryContent">
										<div class="messageContentad">
											<article>

												<!-- ////// FLTOURS //////  -->

												<a href="http://dvcstore.com/sellers.htm" target="blank">
													<img src="http://images.wdwinfo.com/banners/300-timeshare.jpg">
												</a>


												<div style="clear: both;"></div>


												<span class="mobilehide">
													<br />
													<blockquote class="messageText ugc baseHtml">
														<label for="LoginControl">
															<span style="font-weight: bold; color: #004400">
																<!--- <a href="login/" class="concealed noOutline">Log in or Sign up</a>
</label> to hide this advert. -->
													</blockquote>
													</span>


											</article>
										</div>
									</div>
								</li>















							</li>






							<li id="post-59034110" class="message   " data-author="pangyal">



								<div class="messageUserInfo" itemscope="itemscope" itemtype="http://data-vocabulary.org/Person">
									<div class="messageUserBlock ">

										<div class="avatarHolder">
											<span class="helper"></span>
											<a href="members/pangyal.524969/" class="avatar Av524969m" data-avatarhtml="true">
												<img src="data/avatars/m/524/524969.jpg?1483134808" width="96" height="96" alt="pangyal" />
											</a>

											<!-- slot: message_user_info_avatar -->
										</div>




										<h3 class="userText">
											<a href="members/pangyal.524969/" class="username" dir="auto" itemprop="name">pangyal</a>
											<em class="userTitle" itemprop="title">#TeamSven</em>

											<!-- slot: message_user_info_text -->
										</h3>



										<div class="extraUserInfo">



											<dl class="pairsJustified">
												<dt>Joined:</dt>
												<dd>Jul 26, 2014</dd>
											</dl>



											<dl class="pairsJustified">
												<dt>Messages:</dt>
												<dd>
													<a href="search/member?user_id=524969" class="concealed" rel="nofollow">3,614</a>
												</dd>
											</dl>

















										</div>




										<span class="arrow">
											<span></span>
										</span>
									</div>
								</div>

								<div class="messageInfo primaryContent">





									<div class="messageContent">
										<article>
											<blockquote class="messageText SelectQuoteContainer ugc baseHtml">

												<b>PASSED
													<img src="http://www.wdwinfo.com/images/smilies/aniflower.gif" class="mceSmilie" alt=":flower:" title="Title    :flower:"
													/>
													<br />
													<br />
													<br /> AKV:
												</b>
												<br />
												<br /> MB_01---$96-$17602-160-AKV-Jun-0/16, 0/17, 160/18, 160/19- sent 3/9, passed 3/28
												<br />
												<br />
												<br /> Enapai---$100-$24183-220-AKV-SEPT-0/16, 69/17, 220/18, 220/19- sent 3/28, passed 4/9
												<br />
												<br /> kdhunter---$105-$18436-160-AKV-Aug-7/16, 160/17, 160/18, 160/19- sent 3/29, passed 4/9
												<br />
												<br /> nates---$97-$31800-320-AKV-Apr-0/17, 0/18, 320/19, 320/20- sent 3/27, passed 4/9
												<br />
												<br /> evenstephen---$108-$13911-120-AKV-Sep-0/16, 0/17, 66/18, 120/19- sent 4/10, passed 4/19
												<br />
												<br /> Drewferin---$107-$21080-180-AKV-Dec-0/17, 180/18, 180/19- sent 4/11, passed 5/1
												<br />
												<br /> Beesknees6---$110-$12840-110-AKV-Feb-110/17, 110/18, 110/19, 110/20-Seller pays all cc- sent 4/11, passed 5/1
												<br />
												<br /> TotallyMinnie83---$102-$18045-160-AKV-Apr-0/17, 160/18, 160/19, 160/20- sent 4/15, passed 5/1
												<br />
												<br /> DaveNan---$100-$17755-160-AKV-Dec-152/17, 160/18, 160/19-International Seller- sent 4/18, passed 5/8
												<br />
												<br /> hoserland---$115-$20040-160-AKV-Dec-102/17, 160/18, 160/19- sent 4/24, passed 5/11
												<br />
												<br /> Beesknees6---$105-$6431-52-AKV-Feb-0/17, 0/18, 52/19, 52/20-Buyer pays 2018 mf- sent 4/17, passed 5/17
												<br />
												<br /> OneLittleSpark2014---$104-$18276-160-AKV-Oct-0/17, 160/18, 160/19- sent 4/27, passed 5/17
												<br />
												<br /> edgeney---$110-$7610-60-AKV-Feb-0/17, 85/18, 60/19- sent 5/5, passed 5/23
												<br />
												<br /> LawrenceFamily---$95-$22460-230-AKV-Mar-0/17, 0/18, 86/19, 230/20- sent 4/30, passed 5/23
												<br />
												<br /> disfoodie---$100-$21138-200-AKV-Feb-0/17, 72/18, 200/19, 200/20- sent 5/14, passed 5/31
												<br />
												<br /> David K.---$104-$24537-220-AKV-Mar-0/17, 152/18, 220/19-International seller- sent 5/14, passed 5/31
												<br />
												<br />
												<br />
												<b>AUL:</b>
												<br />
												<br />
												<br /> jjwelch24---$85-$17226-170-AUL-Jun-0/17, 170/18, 170/19- sent 3/16, passed 4/23
												<br />
												<br /> Bruin_mouse---$80-$11403-120-AUL-Jun-110/17, 120/18, 120/19- sent 4/3, passed 4/25
												<br />
												<br /> katrinameucci---$135-$7250-50-AUL-Dec-0/17, 50/18, 50/19-Subsidized- sent 4/14, passed 5/1
												<br />
												<br />
												<b>BCV:</b>
												<br />
												<br /> Madame---$132-$38204-270-BCV-Aug-0/17, 270/18, 270/19- sent 3/27, passed 4/9
												<br />
												<br /> Bambi19---$125-$13180-100-BCV-Apr-0/17, 42/18, 100/19, 100/20-No 2018 Dues- sent 4/11, passed 5/1
												<br />
												<br /> krw1243---$140-$16821-110-BCV-Jun-0/17, 220/18, 110/19, 110/20- sent 5/1, passed 5/23
												<br />
												<br /> iheartglaciers(SELLER)---$145-$15025-100-BCV-Feb-0/17, 0/18, 100/19- sent 5/1, passed 5/31
												<br />
												<br />
												<br />
												<b>BLT:</b>
												<br />
												<br />
												<br /> Rylie Grite---$165-$9011-50-BLT-Jun-0/17, 100/18, 50/19- sent 3/22, passed 4/6
												<br />
												<br /> BethuneBoys---$125-$30700-240-BLT-Feb-0/17, 0/18, 240/19, 240/20- sent 4/4, passed 4/16
												<br />
												<br /> jdaly84---$145-$15627-100-BLT-Dec-100/17, 100/18, 100/19- sent 4/5, passed 4/17
												<br />
												<br /> Tarkin18---$130-$21415-160-BLT-Mar-0/17, 0/18, 160/19- sent 4/9, passed 4/19
												<br />
												<br /> DisneyMomKelli---$135-$21890-150-BLT-Mar-0/17, 150/18, 150/19, 150/20- sent 4/10, passed 4/19
												<br />
												<br /> MarcThomas16---$150-$8327-50-BLT-Aug-50/17, 50/18, 50/19- sent 4/19, passed 5/4
												<br />
												<br /> MickeyReeds---$135-$23333-160-BLT-Dec-0/17, 160/18, 160/19- sent 4/16, passed 5/7
												<br />
												<br /> NewYorkMom---$136-$29237-200-BLT-Feb-0/17, 400/18, 200/19, 200/20- sent 5/6, passed 5/23
												<br />
												<br /> 1savvygal---$127-$21467-160-BLT-Aug-0/17, 320/18, 160/19-Seller pays CC- sent 4/27, passed 5/23
												<br />
												<br /> TexasChick123---$135-$21743-150-BLT-Jun-0/17, 156/18, 150/19, 150/20- sent 4/30, passed 5/24
												<br />
												<br /> coopstah13---$132-$28384-200-BLT-Dec-14/17, 200/18, 200/19- sent 5/29, passed 6/6
												<br />
												<br /> haushinka---$156-$8498-50-BLT-Mar-50/17, 50/18, 50/19, 50/20- sent 5/18, passed 6/5
												<br />
												<br />
												<br />
												<b>BWV:
													<br />
												</b>
												<br /> Wanna be Ariel---$106-$16629-150-BWV-Mar-22/17, 150/18, 150/19- sent 3/15, passed 4/3
												<br />
												<br /> Jerry5788---$113-$25826-210-BWV-Jun-0/17, 420/18, 210/19- sent 4/3, passed 4/9
												<br />
												<br /> wl250---$107-$34971-300-BWV-Oct-0/17, 600/18, 300/19- sent 3/28, passed 4/9
												<br />
												<br /> BW18---$121-$26338-200-BWV-Dec-200/16, 200/17, 200/18, 200/19- sent 3/26, passed 4/9
												<br />
												<br /> Beesknees6---$110-$25197-215-BWV-Feb-17/17, 138/18, 215/19, 215/20- sent 4/4, passed 4/17
												<br />
												<br /> Mtob88---$112-$18495-150-BWV-Dec-0/17, 110/18, 150/19- sent 4/14, passed 5/1
												<br />
												<br /> mlittig---$133-$7450-50-BWV-Aug-3/17, 15/18, 50/19 - sent 4/13, passed 5/3
												<br />
												<br /> Cathy C---$108-$26225-235-BWV-Dec-2/17, 235/18, 235/19- sent 4/17, passed 5/17
												<br />
												<br /> MsMinnie---$117-$19188.85-150-BWV-Dec-87/17, 150/18, 150/19- sent 4/17, passed 5/3
												<br />
												<br /> rundisney79---$114-$29854-240-BWV-Oct-240/17, 240/18, 240/19- sent 5/11, passed 5/29
												<br />
												<br /> TexasChick123---$118-$19267-150-BWV-Aug-150/17, 150/18, 150/19- sent 5/10, passed 5/31
												<br />
												<br /> mlittig---$150-$8457-50-BWV-Aug-0/16, 0/17, 50/18, 50/19- sent 5/18, passed 6/5
												<br />
												<br /> DisHeels---$114-$24927-200-BWV-Oct-0/17, 286/18, 200/19- sent 5/21, passed 6/6
												<br />
												<br />
												<br />
												<br />
												<b>HH:</b>
												<br />
												<br /> tedhowe(Seller)---$75-$12903-150-HH-Oct-49/17, 150/18, 150/19- sent 3/21, passed 4/3
												<br />
												<br /> darby888---$75-$8971-100-HHI-June-7/17, 100/18, 100/19- sent 4/13, passed 5/1
												<br />
												<br /> dbehnken80---$70-$16110-200-HH-Feb-0/17, 183/18, 200/19, 200/20- sent 4/17, passed 5/4
												<br />
												<br />
												<br />
												<b>OKW:</b>
												<br />
												<br /> mlittig---$103-$11758-100-OKW-Dec-0/17, 100/18, 100/19 - sent 4/24, passed 5/7
												<br />
												<br />
												<b>
													<br /> OKW EXTENDED:</b>
												<br />
												<br /> rootbeerkid---$105-$6000-50-OKW(E)-Sep-0/16, 15/17, 50/18, 50/19- sent 3/26, passed 4/9
												<br />
												<br />
												<b>
													<br /> PVB:
												</b>
												<br />
												<br /> Misspiggy1978---$169-$9200-50-PVB-Dec-2/17, 50/18, 50/19- sent 3/6, passed 3/22
												<br />
												<br /> LYSE---$135-$29083-200-PVB-Oct-200/17, 400/18, 200/19- Sent 3/20, passed 4/5
												<br />
												<br /> PKen82---$135-$21040-150-PVB-Mar-0/17, 0/18, 150/19- sent 3/26, passed 4/10
												<br />
												<br /> Moonlight Graham---$141-$19125-125-PVB-Oct-0/17, 125/18, 125/19- sent 4/6, passed 4/13
												<br />
												<br /> nikerbokers---$145-$15120-100-PVB-Jun-0/17, 100/18, 100/19-Seller pays CC- sent 4/3, passed 4/19
												<br />
												<br /> ten50---$130-$14322-100-PVB-Apr-0/17, 100/18, 100/19- sent 4/12, passed 4/26
												<br />
												<br /> Unicorn Dreams---$135-$21945-150-PVB-Dec-0/16, 150/17, 300/18,
												<a href="https://www.disboards.com/tel:150/19-2017" class="internalLink">150/19-2017</a> are holding- sent 4/11, passed 5/1
												<br />
												<br /> striker1064---$139-$21538-150-PVB-Aug-0/17, 11/18, 150/19- sent 5/4, passed 5/24
												<br />
												<br /> Mumof4mice---$135-$27650-200-PVB-Dec-0/16, 4/17, 200/18, 200/19-Seller pays 2018 MF- sent 4/27, passed 5/29
												<br />
												<br /> Jerry5788---$110-$57247-500-PVB-Dec-0/17, 185/18, 500/19- sent 5/22, passed 6/5
												<br />
												<br /> JennaShapiro---$140-$19022-125-PVB-Jun-125/17, 202/18, 125/19, 125/20- sent 4/27, passed 6/5
												<br />
												<b>
													<br />
													<br />
													<br /> SSR:
												</b>
												<br />
												<br /> kwelch10377---$95-$16150-170-SSR-Jun-0/17, 174/18, 170/19- sent 3/27, passed 4/9
												<br />
												<br /> NLW814---$92.5-$17321-170-SSR-Mar-0/17, 153/18, 170/19- sent 3/27, passed 4/9
												<br />
												<br /> babydreamz---$99-$13763-125-SSR-Dec-125/17, 125/18, 125/19- sent 4/6, passed 4/13
												<br />
												<br /> dfisher9---$93-$20523-200-SSR-Mar-0/17, 292/18, 200/19, 200/20- sent 4/9, passed 4/14
												<br />
												<br /> DaveNan---$97-$15984-150-SSR-Sep-110/17, 150/18, 150/19- sent 4/12, passed 5/2
												<br />
												<br /> whositsgalore---$97-$12349-120-SSR-Feb-0/17, 120/18, 120/19, 120/20- sent 5/3, passed 5/23
												<br />
												<br /> DizneyLizzy---$101-$5550-50-SSR-Feb-0/17, 0/18, 27/19, 50/20- sent 4/30, passed 5/23
												<br />
												<br /> crushonminie---$94-$20723-200-SSR-Feb-0/17, 200/18, 200/19, 200/20- sent 5/15, passed 5/23
												<br />
												<br /> disneyeveryyear---$100-$17493-160-SSR-Jun-0/17, 320/18, 160/19, 160/20- sent 4/27, passed 5/23
												<br />
												<br /> wings91---$95-$25900-250-SSR-Jun-0/17, 500/18, 250/19- sent 5/4, passed 5/23
												<br />
												<br /> RickL---$100-$11038-100-SSR-Apr-100/17, 100/18, 100/19, 100/20- sent 4/30, passed 5/23
												<br />
												<br /> lola_stark42---$97-$17650-160-SSR-Sep-0/17, 169/18, 160/19- sent 5/7, passed 5/30
												<br />
												<br /> fearthisinc---$95-$21060-200-SSR-Dec-108/16, 200/17, 200/18, 200/19- sent 5/1, passed 6/4
												<br />
												<br /> Courtney924---$100-$10635-100-SSR-Jun-0/17, 100/18, 100/19- sent 5/21, passed 6/5
												<br />
												<br />
												<br />
												<b>VGC:</b>
												<br />
												<br /> MommyCook---$190-$19799-100-VGC-Sep-0/17, 0/18, 100/19- sent 4/6, passed 4/19
												<br />
												<br /> Disneylovinfamilyof6---$150-$30195-200-VGC-Feb-0/17, 12/18, 200/19, 200/20-Seller pays CC&amp;‘18MF- sent 4/11,
												passed 5/1
												<br />
												<br /> kms75---$170-$57161-325-VGC-Jun-0/17, 403/18, 325/19- sent 4/16, passed 5/3
												<br />
												<br /> Bruin_mouse---$182-$9894-50-VGC-Sep-49/17, 100/18, 50/19- sent 4/26, passed 5/23
												<br />
												<br /> Bruin_mouse---$182-$9894-50-VGC-Sep-50/17, 100/18, 50/19- sent 4/26, passed 5/23
												<br />
												<br /> Discanucksw---$186-$46918-240-VGC-Jun-0/17, 480/18, 240/19- sent 4/21, passed 5/23
												<br />
												<b>
													<br /> VGF:
												</b>
												<br />
												<br /> gergy9---$128-$16791-125-VGF-Dec-0/17, 125/18, 125/19-Seller Pays MF &#039;18- sent 3/14, passed 4/6
												<br />
												<br /> DisneyDee81---$140-$19121-130-VGF-Dec-0/17, 65/18, 130/19- sent 3/24, passed 4/9
												<br />
												<br /> Disneylovinfamilyof6---$150-$21048-130-VGF-Jun-39/17, 260/18, 130/19-Seller pays ‘17 MF- sent 4/3, passed 4/17
												<br />
												<br /> Disneylovinfamilyof6---$155-$15690-100-VGF-Jun-0/17, 31/18, 100/19-Seller pays CC- sent 4/11, passed 5/1
												<br />
												<br /> Disneylovinfamilyof6---$145-$17595-120-VGF-Jun-0/17, 0/18, 120/19, 120/20-Seller pays CC- sent 4/25, passed
												5/17
												<br />
												<br /> jaybaileys---$145-$15813-100-VGF-Mar-0/17, 100/18, 100/19- sent 4/25, passed 5/17
												<br />
												<br /> kboo---$150-$15742-100-VGF-Aug-0/16, 124/17, 16/18, 100/19-124 pts expire 7.31- sent 5/17, passed 6/5
												<br />
												<br />
												<br />
												<b>WL/ BRV:</b>
												<br />
												<br />
												<br />
												<br />
												<b>
													<br /> WL/ CCV:
													<br />
													<br />
													<br /> VB:
												</b>
												<br />
												<br />
												<br />
												<br />
												<br />
												<br />
												<b>
													<b>WAITING
														<img src="http://www.disboards.com/data/smilies/cool.gif" class="mceSmilie" alt=":cool:" title="Cool    :cool:" />
														<br />
														<br />
														<br /> AKV:
													</b>
												</b>
												<br />
												<br />
												<br />
												<br /> motherof5---$100-$29586-270-AKV-Apr-264/17, 270/18, 270/19- sent 3/8
												<br />
												<br /> Calculator---$93-$20425-200-AKV-Jun-0/17, 156/18, 200/19- sent 3/12
												<br />
												<br /> Lgarland86---$103-$11602-100-AKV-Dec-0/17, 100/18, 100/19- sent 4/24
												<br />
												<br /> NHLFAN---$103-$11631-100-AKV-Dec-184/17, 100/18, 100/19- sent 4/5
												<br />
												<br /> Jerry5788---$100-$21100-205-AKV-Sep-66/17, 83/18, 205/19-international seller- sent 5/8
												<br />
												<br /> NewbieMom---$88-$14839-150-AKV-Apr-0/17, 150/18, 150/19, 150/20- sent 5/7
												<br />
												<br /> Dan1---$101-$12693-120-AKV-Feb-0/17, 0/18, 120/19, 120/20- sent 4/27
												<br />
												<br /> Gilbert Loo---$112-$24382-200-AKV-Dec-200/17, 200/18, 200/19- sent 5/23
												<br />
												<br /> NewYorkMom---$99-$19519-180-AKV-Feb-0/17, 154/18, 180/19, 180/20- sent 5/13
												<br />
												<br /> JimBoWyn---$110-$14953-125-AKV-Dec-0/16, 0/17, 100/18, 125/19- sent 5/30
												<br />
												<br /> Dan1---$105-$22412-200-AKV-Oct-0/16, 9/17, 200/18, 200/19-Seller pays closing- sent 5/31
												<br />
												<br /> Dan1---$105-$21866-200-AKV-Oct-0/16, 0/17, 38/18, 200/19- sent 6/4
												<br />
												<br /> mharvey23---$113-$12471-100-AKV-Oct-0/17, 200/18, 100/19- sent 5/28
												<br />
												<br /> icesk8abc---$105-$18436-160-AKV-Aug-0/17, 160/18, 160/19- sent 6/6
												<br />
												<br />
												<br />
												<b>
													<b>AUL:</b>
												</b>
												<br />
												<br />
												<br />
												<br />
												<b>
													<b>
														<br />
														<br /> BCV:
													</b>
												</b>
												<br />
												<br /> NickBCV---$132-$33951-250-BCV-Apr-0/17, 0/18, 180/19, 250/20- sent 5/29 (seller)
												<br />
												<br /> Hammer22---$137.5-$22375-160-BCV-Mar-0/17, 0/18, 160/19, 160/20- sent 6/1
												<br />
												<b>
													<b>
														<br /> BLT:
													</b>
												</b>
												<br />
												<br />
												<br /> NewbieMom---$120-$19525-150-BLT-Dec-0/17, 300/18, 150/19- sent 5/16
												<br />
												<br /> Jerry5788---$130-$22537-160-BLT-Sep-0/16, 0/17, 320/18, 160/19- sent 5/23
												<br />
												<br />
												<b>
													<b>
														<br /> BWV:
													</b>
												</b>
												<br />
												<br />
												<br />
												<br /> Nancy---$143-$9603-60-BWV-Jun-60/17, 60/18, 60/19- sent 3/19
												<br />
												<br />
												<br />
												<br />
												<br />
												<br />
												<b>
													<b>
														<br /> HH:
													</b>
												</b>
												<br />
												<br />
												<br />
												<br />
												<b>
													<b>
														<br /> OKW:
													</b>
												</b>
												<br />
												<br />
												<br />
												<br />
												<br /> Reneedisnerd---$90-$23029-230-OKW-Aug-0/17, 222/18, 230/19- sent 5/11
												<br />
												<br /> ajjonesehc---$87-$19433-220-OKW-Mar-0/17, 0/18, 220/19, 220/20-seller pays 1/2 closing costs- sent 5/21
												<br />
												<br /> JV63---$90-$24025-260-OKW-Apr-0/17, 220/18, 260/19, 260/20-Seller pays &#039;18 dues- sent 5/25
												<br />
												<br /> jvattes---$109-$17904-150-OKW-Dec-0/16, 150/17, 300/18, 150/19- sent 5/29
												<br />
												<br /> Making Moore Memories---$87-$19861-210-OKW-Sep-0/16, 0/17, 127/18, 210/19- sent 5/29
												<br />
												<br />
												<b>
													<b>
														<br /> OKW EXTENDED:</b>
												</b>
												<br />
												<br />
												<br /> DizneyLizzy---$109-$11998-100-OKW(E)-Aug-0/17, 100/18, 100/19- sent 4/24
												<br />
												<br />
												<br />
												<b>
													<b>PVB:</b>
												</b>
												<br />
												<br /> Mumof4mice---$144.5-$30140-200-PVB-Dec-0/16, 198/17, 200/18, 200/19-Seller pays CC- sent 5/26
												<br />
												<br /> Mskcl131---$140-$10969-75-PVB-Feb-0/17, 0/18, 34/19, 75/20- sent 6/4
												<br />
												<br />
												<br />
												<b>
													<b>SSR:</b>
												</b>
												<br />
												<br />
												<br />
												<br /> Gamomof2---$94-$18800-200-SSR-Feb-0/17, 10/18, 200/19, 200/20-seller pays MF &#039;18- sent 3/28
												<br />
												<br /> aoconnor(seller)---$98-$21564-202-SSR-Feb-0/17, 202/18, 202/19- sent 4/17
												<br />
												<br /> Blacklablover---$90-$18750-200-SSR-Dec-0/17, 36/18, 200/19- sent 4/12
												<br />
												<br /> Buzz&#039;s Buddy---$91-$18200-200-SSR-Sep-4/17, 0/18, 200/19-Seller pays closing- sent 5/10
												<br />
												<br /> Preacherroe---$90-$23230-250-SSR-Jun-0/17, 17/18, 250/19, 250/20- sent 5/14
												<br />
												<br /> Alldayidreamaboutdisney---$94-$16691-160-SSR-Aug-0/16, 0/17, 162/18, 160/19- sent 5/16
												<br />
												<br /> thumper729---$97-$16065-160-SSR-Dec-0/17, 9/18, 160/19- sent 5/21
												<br />
												<br /> Eaglesrest---$99-$22631-210-SSR-Mar-0/17, 210/18, 210/19, 210/20- sent 5/30
												<br />
												<br />
												<b>
													<b>
														<br />
														<br /> VGC:
													</b>
												</b>
												<br />
												<br />
												<br />
												<br />
												<br />
												<b>
													<b>VGF:</b>
												</b>
												<br />
												<br />
												<br />
												<br />
												<b>
													<b>
														<br /> WL/ BRV:</b>
												</b>
												<br />
												<br />
												<br />
												<br /> beourguest2009---$110-$6444-50-BRV@WL-Aug-0/16, 0/17, 100/18, 50/19- sent 5/25
												<br />
												<br />
												<br />
												<br />
												<b>
													<b>WL/ CCV:
														<br />
														<br />
														<br /> VB:
													</b>
												</b>
												<br />
												<br />
												<br />
												<b>
													<b>
														<br /> TAKEN
														<img src="http://www.wdwinfo.com/images/smilies/crazy.gif" class="mceSmilie" alt=":crazy2:" title="crazy    :crazy2:" />
														<br />
														<br />
														<br />
														<br /> AKV:
													</b>
												</b>
												<br />
												<br /> DisneynBison---$97-$21452-200-AKV-Dec-0/16, 300/17, 200/18, 200/19- sent 3/12, taken 4/3
												<br />
												<br /> Renée H---$92-$20363-210-AKV-Feb-0/17, 56/18, 210/19, 210/20- sent 3/11, taken 4/4
												<br />
												<br /> evenstephen---$107-$13465-120-AKV-Dec-0/16, 0/17, 0/18, 120/19- sent 3/16, taken 4/6
												<br />
												<br /> OneLittleSpark2014---$95-$10921-100-AKV-Mar-0/17, 100/18, 100/19- sent 3/16, taken 4/9
												<br />
												<br /> icesk8abc---$97-$17321-160-AKV-Jun-160/17, 304/18, 160/19- sent 3/19, taken 4/11
												<br />
												<br /> hoserland---$97-$16785-160-AKV-Dec-0/17, 160/18, 160/19-Split 2018 MFs- sent 3/27, taken 4/20
												<br />
												<br /> jenr812---$98-$14303-130-AKV-Sep-26/17, 260/18, 130/19- sent 4/2, taken 5/1
												<br />
												<br /> NHLFAN---$103-$11631-100-AKV-Dec-184/17, 100/18, 100/19- sent 4/5, taken 5/2
												<br />
												<br /> David K.---$102-$22356-200-AKV-Sep-0/17, 200/18, 200/19- sent 4/12, taken 5/8
												<br />
												<br /> Gilbert Loo---$103-$23966-220-AKV-Oct-0/16, 55/17, 100/18, 220/19- sent 4/23 taken 5/23
												<br />
												<br /> JimBoWyn---$100-$12566-120-AKV-Feb-0/17, 0/18, 120/19, 120/20- sent 4/27, taken 5/27
												<br />
												<br /> Dan1---$101-$12693-120-AKV-Feb-0/17, 0/18, 120/19, 120/20- sent 4/27, taken 5/28
												<br />
												<br />
												<br />
												<b>
													<b>AUL:
														<br />
														<br />
														<br /> BCV:
													</b>
												</b>
												<br />
												<br />
												<br />
												<br />
												<b>
													<b>
														<br /> BLT:
													</b>
												</b>
												<br />
												<br />
												<br />
												<br />
												<br />
												<b>
													<b>BWV:</b>
												</b>
												<br />
												<br /> rundisney79---$100-$54775-500-BWV-Feb-500/17, 500/18, 500/19, 500/20- sent 4/10, taken 5/4
												<br />
												<br />
												<br />
												<b>
													<b>
														<br /> HH:
													</b>
												</b>
												<br />
												<br />
												<br />
												<b>
													<b>
														<br /> OKW:
													</b>
												</b>
												<br />
												<br /> JV63---$80-$22215-270-OKW-Mar-0/17, 100/18, 49/19, 270/20-Seller pays 18/19 MF- sent 3/12, taken 4/12
												<br />
												<br /> lola_stark42---$74-$17273-220-OKW-Oct-0/17, 10/18, 220/19- sent 4/3, taken 5/2
												<br />
												<br /> Reneedisnerd---$80-$13453-150-OKW-Mar-0/17, 150/18, 150/19, 150/20- sent 4/11, taken 5/9
												<br />
												<br /> ajjonesehc---$73-$23942-300-OKW-Mar-0/17, 323/18, 300/19, 300/20- sent 4/16, taken 5/15
												<br />
												<br /> JV63---$82-$22765-270-OKW-Oct-0/16, 0/17, 0/18, 270/19- sent 4/19, taken 5/16
												<br />
												<br />
												<b>
													<b>
														<br /> OKW EXTENDED:</b>
												</b>
												<br />
												<br /> Tinks624---$93-$7140-70-OKW(E)-Aug-0/16, 0/17, 0/18, 70/19- sent 4/15, taken 5/11
												<br />
												<b>
													<b>
														<br /> PVB:
													</b>
												</b>
												<br />
												<br />
												<br />
												<br />
												<b>
													<b>
														<br /> SSR:
													</b>
												</b>
												<br />
												<br /> ajjonesehc---$89-$24854-270-SSR-Mar-72/17, 270/18, 270/19- sent 3/9- taken 4/3
												<br />
												<br /> DaveNan---$90-$15085-150-SSR-Dec-50/17, 150/18, 150/19- sent 3/12, taken 4/3
												<br />
												<br /> rwatson626---$86-$18630-210-SSR-Feb-0/17, 0/18, 210/19, 210/20- sent 3/20, taken 4/10
												<br />
												<br /> Mtob88---$92-$13274-130-SSR-Dec-35/17, 130/18, 130/19- sent 3/22, taken 4/11
												<br />
												<br /> thumper729---$92-$15300-160-SSR-Oct-0/17, 0/18, 160/19- sent 3/21, taken 4/11
												<br />
												<br /> TexasChick123---$85-$14297-150-SSR-Mar-38/17, 150/18, 150/19, 150/20-Seller banked 2017 pts- sent 3/26, taken
												4/17
												<br />
												<br /> Erika Ambourn---$92-$18022-185-SSR-Mar-0/17, 160/18, 185/19, 185/20- sent 3/28, taken 4/19
												<br />
												<br /> Calculator---$90-$22500-250-SSR-Apr-0/17, 0/18, 250/19-Seller pays closing- sent 3/31, taken 4/29
												<br />
												<br /> Jerry5788---$88-$15528-160-SSR-Mar-81/17, 160/18, 160/19- sent 4/11, taken 5/4
												<br />
												<br /> Blacklablover---$90-$18750-200-SSR-Dec-0/17, 36/18, 200/19- sent 4/12, taken 5/7
												<br />
												<br /> wfishy5---$89-$25724-270-SSR-Mar-0/17, 174/18, 270/19- sent 4/13, taken 5/9
												<br />
												<br /> Thumper729---$95-$14725-150-SSR-Oct-0/17, 2/18, 150/19- sent 4/16, taken 5/14
												<br />
												<br /> Courtney924---$95-$10110-100-SSR-Apr-0/17, 100/18, 100/19- sent 4/19, taken 5/16
												<br />
												<br /> Samucy---$83-$19333-210-SSR-Dec-7/17, 210/18, 210/19- sent 4/9, taken 5/21
												<br />
												<br /> eaglesrest---$89-$29038-300-SSR-Dec-12/17, 125/18, 300/19- sent 4/27, taken 5/25
												<br />
												<br /> JimBoWyn---$90-$9647-100-SSR-Mar-0/17, 0/18, 100/19, 100/20- sent 4/3, taken 4/20
												<br />
												<br /> Calculator---$95-$22325-235-SSR-Oct-0/17, 9/18, 235/19-Seller pays closing- sent 4/30, taken 5/30
												<br />
												<br />
												<br />
												<b>
													<b>VGC:
														<br />
														<br />
														<br />
														<br /> VGF:
													</b>
												</b>
												<br />
												<br /> rwthompson82---$135-$19065-130-VGF-Aug-0/16, 6/17, 124/18, 130/19- sent 4/3, taken 4/25
												<br />
												<b>
													<b>
														<br /> WL/ BRV:</b>
												</b>
												<br />
												<br />
												<br />
												<br />
												<b>
													<b>WL/ CCV:
														<br />
														<br />
														<br />
														<br /> VB:
													</b>
												</b>
												<div class="messageTextEndMarker">&nbsp;</div>
											</blockquote>
										</article>


									</div>



									<div class="editDate">

										Last edited:
										<abbr class="DateTime" data-time="1528564129" data-diff="109772" data-datestring="Jun 9, 2018" data-timestring="12:08 PM">Jun 9, 2018 at 12:08 PM</abbr>

									</div>






									<div class="messageMeta ToggleTriggerAnchor">

										<div class="privateControls">

											<span class="item muted">
												<span class="authorEnd">
													<a href="members/pangyal.524969/" class="username author" dir="auto">pangyal</a>,</span>
												<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/#post-59034110"
												 title="Permalink" class="datePermalink">
													<span class="DateTime" title="Apr 3, 2018 at 12:51 PM">Apr 3, 2018</span>
												</a>
											</span>









											<a href="posts/59034110/report" class="OverlayTrigger item control report" data-cacheOverlay="false">
												<span></span>Report</a>



										</div>

										<div class="publicControls">
											<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/#post-59034110"
											 title="Permalink" class="item muted postNumber hashPermalink OverlayTrigger" data-href="posts/59034110/permalink">#3</a>


											<a href="posts/59034110/like" class="LikeLink item control like" data-container="#likes-post-59034110">
												<span></span>
												<span class="LikeLabel">Like</span>
											</a>


											<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/reply?quote=59034110"
											 data-messageid="59034110" class="MultiQuoteControl JsOnly item control" title="Toggle Multi-Quote">
												<span></span>
												<span class="symbol">+ Quote</span>
											</a>
											<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/reply?quote=59034110"
											 data-postUrl="posts/59034110/quote" data-tip="#MQ-59034110" class="ReplyQuote item control reply" title="Reply, quoting this message">
												<span></span>Reply</a>


										</div>
									</div>


									<div id="likes-post-59034110"></div>
								</div>




















							</li>






							<li id="post-59034140" class="message   " data-author="DisneynBison">



								<div class="messageUserInfo" itemscope="itemscope" itemtype="http://data-vocabulary.org/Person">
									<div class="messageUserBlock ">

										<div class="avatarHolder">
											<span class="helper"></span>
											<a href="members/disneynbison.431089/" class="avatar Av431089m" data-avatarhtml="true">
												<img src="styles/default/xenforo/avatars/avatar_male_m.png" width="96" height="96" alt="DisneynBison" />
											</a>

											<!-- slot: message_user_info_avatar -->
										</div>




										<h3 class="userText">
											<a href="members/disneynbison.431089/" class="username" dir="auto" itemprop="name">DisneynBison</a>
											<em class="userTitle" itemprop="title">Mouseketeer</em>

											<!-- slot: message_user_info_text -->
										</h3>



										<div class="extraUserInfo">



											<dl class="pairsJustified">
												<dt>Joined:</dt>
												<dd>Jun 6, 2012</dd>
											</dl>



											<dl class="pairsJustified">
												<dt>Messages:</dt>
												<dd>
													<a href="search/member?user_id=431089" class="concealed" rel="nofollow">193</a>
												</dd>
											</dl>

















										</div>




										<span class="arrow">
											<span></span>
										</span>
									</div>
								</div>

								<div class="messageInfo primaryContent">





									<div class="messageContent">
										<article>
											<blockquote class="messageText SelectQuoteContainer ugc baseHtml">

												I guess its april I should put this here
												<br />
												<br /> DisneynBison---$97-$21452-200-AKV-Dec-0/16, 300/17, 200/18, 200/19- sent 3/12, taken 4/3
												<div class="messageTextEndMarker">&nbsp;</div>
											</blockquote>
										</article>


									</div>








									<div class="messageMeta ToggleTriggerAnchor">

										<div class="privateControls">

											<span class="item muted">
												<span class="authorEnd">
													<a href="members/disneynbison.431089/" class="username author" dir="auto">DisneynBison</a>,</span>
												<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/#post-59034140"
												 title="Permalink" class="datePermalink">
													<span class="DateTime" title="Apr 3, 2018 at 12:58 PM">Apr 3, 2018</span>
												</a>
											</span>









											<a href="posts/59034140/report" class="OverlayTrigger item control report" data-cacheOverlay="false">
												<span></span>Report</a>



										</div>

										<div class="publicControls">
											<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/#post-59034140"
											 title="Permalink" class="item muted postNumber hashPermalink OverlayTrigger" data-href="posts/59034140/permalink">#4</a>


											<a href="posts/59034140/like" class="LikeLink item control like" data-container="#likes-post-59034140">
												<span></span>
												<span class="LikeLabel">Like</span>
											</a>


											<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/reply?quote=59034140"
											 data-messageid="59034140" class="MultiQuoteControl JsOnly item control" title="Toggle Multi-Quote">
												<span></span>
												<span class="symbol">+ Quote</span>
											</a>
											<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/reply?quote=59034140"
											 data-postUrl="posts/59034140/quote" data-tip="#MQ-59034140" class="ReplyQuote item control reply" title="Reply, quoting this message">
												<span></span>Reply</a>


										</div>
									</div>


									<div id="likes-post-59034140"></div>
								</div>




















							</li>






							<li id="post-59034221" class="message   " data-author="TexasChick123">



								<div class="messageUserInfo" itemscope="itemscope" itemtype="http://data-vocabulary.org/Person">
									<div class="messageUserBlock ">

										<div class="avatarHolder">
											<span class="helper"></span>
											<a href="members/texaschick123.594878/" class="avatar Av594878m" data-avatarhtml="true">
												<img src="data/avatars/m/594/594878.jpg?1488133992" width="96" height="96" alt="TexasChick123" />
											</a>

											<!-- slot: message_user_info_avatar -->
										</div>




										<h3 class="userText">
											<a href="members/texaschick123.594878/" class="username" dir="auto" itemprop="name">TexasChick123</a>
											<em class="userTitle" itemprop="title">Always Dreaming of Our Next Vacation</em>

											<!-- slot: message_user_info_text -->
										</h3>



										<div class="extraUserInfo">



											<dl class="pairsJustified">
												<dt>Joined:</dt>
												<dd>Feb 19, 2017</dd>
											</dl>



											<dl class="pairsJustified">
												<dt>Messages:</dt>
												<dd>
													<a href="search/member?user_id=594878" class="concealed" rel="nofollow">733</a>
												</dd>
											</dl>

















										</div>




										<span class="arrow">
											<span></span>
										</span>
									</div>
								</div>

								<div class="messageInfo primaryContent">





									<div class="messageContent">
										<article>
											<blockquote class="messageText SelectQuoteContainer ugc baseHtml">

												<div class="bbCodeBlock bbCodeQuote" data-author="DisneynBison">
													<aside>

														<div class="attribution type">DisneynBison said:

															<a href="goto/post?id=59034140#post-59034140" class="AttributionLink">&uarr;</a>

														</div>

														<blockquote class="quoteContainer">
															<div class="quote">I guess its april I should put this here
																<br />
																<br /> DisneynBison---$97-$21452-200-AKV-Dec-0/16, 300/17, 200/18, 200/19- sent 3/12, taken 4/3</div>
															<div class="quoteExpand">Click to expand...</div>
														</blockquote>
													</aside>
												</div>I’m sorry. Who knew December AKV was such a sought after UY for that resort? That seems to be the bulk of AKV
												buybacks recently.
												<img src="http://www.disboards.com/data/smilies/frown.gif" class="mceSmilie" alt=":(" title="Frown    :(" />
												<div class="messageTextEndMarker">&nbsp;</div>
											</blockquote>
										</article>


									</div>








									<div class="messageMeta ToggleTriggerAnchor">

										<div class="privateControls">

											<span class="item muted">
												<span class="authorEnd">
													<a href="members/texaschick123.594878/" class="username author" dir="auto">TexasChick123</a>,</span>
												<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/#post-59034221"
												 title="Permalink" class="datePermalink">
													<span class="DateTime" title="Apr 3, 2018 at 1:11 PM">Apr 3, 2018</span>
												</a>
											</span>









											<a href="posts/59034221/report" class="OverlayTrigger item control report" data-cacheOverlay="false">
												<span></span>Report</a>



										</div>

										<div class="publicControls">
											<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/#post-59034221"
											 title="Permalink" class="item muted postNumber hashPermalink OverlayTrigger" data-href="posts/59034221/permalink">#5</a>


											<a href="posts/59034221/like" class="LikeLink item control like" data-container="#likes-post-59034221">
												<span></span>
												<span class="LikeLabel">Like</span>
											</a>


											<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/reply?quote=59034221"
											 data-messageid="59034221" class="MultiQuoteControl JsOnly item control" title="Toggle Multi-Quote">
												<span></span>
												<span class="symbol">+ Quote</span>
											</a>
											<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/reply?quote=59034221"
											 data-postUrl="posts/59034221/quote" data-tip="#MQ-59034221" class="ReplyQuote item control reply" title="Reply, quoting this message">
												<span></span>Reply</a>


										</div>
									</div>


									<div id="likes-post-59034221"></div>
								</div>




















							</li>






							<li id="post-59034438" class="message   " data-author="Lola_Stark42">



								<div class="messageUserInfo" itemscope="itemscope" itemtype="http://data-vocabulary.org/Person">
									<div class="messageUserBlock ">

										<div class="avatarHolder">
											<span class="helper"></span>
											<a href="members/lola_stark42.592050/" class="avatar Av592050m" data-avatarhtml="true">
												<img src="styles/default/xenforo/avatars/avatar_female_m.png" width="96" height="96" alt="Lola_Stark42" />
											</a>

											<!-- slot: message_user_info_avatar -->
										</div>




										<h3 class="userText">
											<a href="members/lola_stark42.592050/" class="username" dir="auto" itemprop="name">Lola_Stark42</a>
											<em class="userTitle" itemprop="title">Mouseketeer</em>

											<!-- slot: message_user_info_text -->
										</h3>



										<div class="extraUserInfo">



											<dl class="pairsJustified">
												<dt>Joined:</dt>
												<dd>Jan 9, 2017</dd>
											</dl>



											<dl class="pairsJustified">
												<dt>Messages:</dt>
												<dd>
													<a href="search/member?user_id=592050" class="concealed" rel="nofollow">88</a>
												</dd>
											</dl>

















										</div>




										<span class="arrow">
											<span></span>
										</span>
									</div>
								</div>

								<div class="messageInfo primaryContent">





									<div class="messageContent">
										<article>
											<blockquote class="messageText SelectQuoteContainer ugc baseHtml">

												Same with mine, I see it up there, I&#039;ll go ahead and post it again since it is April.
												<br />
												<br /> lola_stark42---$74-$17273-220-OKW-Oct-0/17, 10/18, 220/19- sent 4/3
												<br />
												<br /> Going to be a looooooooog few weeks!!
												<div class="messageTextEndMarker">&nbsp;</div>
											</blockquote>
										</article>


									</div>








									<div class="messageMeta ToggleTriggerAnchor">

										<div class="privateControls">

											<span class="item muted">
												<span class="authorEnd">
													<a href="members/lola_stark42.592050/" class="username author" dir="auto">Lola_Stark42</a>,</span>
												<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/#post-59034438"
												 title="Permalink" class="datePermalink">
													<span class="DateTime" title="Apr 3, 2018 at 1:50 PM">Apr 3, 2018</span>
												</a>
											</span>









											<a href="posts/59034438/report" class="OverlayTrigger item control report" data-cacheOverlay="false">
												<span></span>Report</a>



										</div>

										<div class="publicControls">
											<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/#post-59034438"
											 title="Permalink" class="item muted postNumber hashPermalink OverlayTrigger" data-href="posts/59034438/permalink">#6</a>


											<a href="posts/59034438/like" class="LikeLink item control like" data-container="#likes-post-59034438">
												<span></span>
												<span class="LikeLabel">Like</span>
											</a>


											<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/reply?quote=59034438"
											 data-messageid="59034438" class="MultiQuoteControl JsOnly item control" title="Toggle Multi-Quote">
												<span></span>
												<span class="symbol">+ Quote</span>
											</a>
											<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/reply?quote=59034438"
											 data-postUrl="posts/59034438/quote" data-tip="#MQ-59034438" class="ReplyQuote item control reply" title="Reply, quoting this message">
												<span></span>Reply</a>


										</div>
									</div>


									<div id="likes-post-59034438"></div>
								</div>




















							</li>






							<li id="post-59034546" class="message   " data-author="Miss Piggy 1978">



								<div class="messageUserInfo" itemscope="itemscope" itemtype="http://data-vocabulary.org/Person">
									<div class="messageUserBlock ">

										<div class="avatarHolder">
											<span class="helper"></span>
											<a href="members/miss-piggy-1978.561764/" class="avatar Av561764m" data-avatarhtml="true">
												<img src="styles/default/xenforo/avatars/avatar_female_m.png" width="96" height="96" alt="Miss Piggy 1978" />
											</a>

											<!-- slot: message_user_info_avatar -->
										</div>




										<h3 class="userText">
											<a href="members/miss-piggy-1978.561764/" class="username" dir="auto" itemprop="name">Miss Piggy 1978</a>
											<em class="userTitle" itemprop="title">Earning My Ears</em>

											<!-- slot: message_user_info_text -->
										</h3>



										<div class="extraUserInfo">



											<dl class="pairsJustified">
												<dt>Joined:</dt>
												<dd>Aug 31, 2015</dd>
											</dl>



											<dl class="pairsJustified">
												<dt>Messages:</dt>
												<dd>
													<a href="search/member?user_id=561764" class="concealed" rel="nofollow">36</a>
												</dd>
											</dl>

















										</div>




										<span class="arrow">
											<span></span>
										</span>
									</div>
								</div>

								<div class="messageInfo primaryContent">





									<div class="messageContent">
										<article>
											<blockquote class="messageText SelectQuoteContainer ugc baseHtml">

												<div class="bbCodeBlock bbCodeQuote" data-author="Miss Piggy 1978">
													<aside>

														<div class="attribution type">Miss Piggy 1978 said:

															<a href="goto/post?id=58982589#post-58982589" class="AttributionLink">&uarr;</a>

														</div>

														<blockquote class="quoteContainer">
															<div class="quote">So we passed ROFR, no big shock at that price
																<img src="styles/default/xenforo/clear.png" class="mceSmilieSprite mceSmilie7" alt=":P" title="Stick Out Tongue    :P" />
																<br />
																<br /> This was definitely a heart, not head decision!</div>
															<div class="quoteExpand">Click to expand...</div>
														</blockquote>
													</aside>
												</div>Sorry, I’ve just realised I didn’t put the date we passed on so it hasn’t been updated.
												<br />
												<br /> Misspiggy1978---$169-$9200-50-PVB-Dec-2/17, 50/18, 50/19- sent 3/6 Passed 3/22
												<div class="messageTextEndMarker">&nbsp;</div>
											</blockquote>
										</article>


									</div>








									<div class="messageMeta ToggleTriggerAnchor">

										<div class="privateControls">

											<span class="item muted">
												<span class="authorEnd">
													<a href="members/miss-piggy-1978.561764/" class="username author" dir="auto">Miss Piggy 1978</a>,</span>
												<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/#post-59034546"
												 title="Permalink" class="datePermalink">
													<span class="DateTime" title="Apr 3, 2018 at 2:12 PM">Apr 3, 2018</span>
												</a>
											</span>









											<a href="posts/59034546/report" class="OverlayTrigger item control report" data-cacheOverlay="false">
												<span></span>Report</a>



										</div>

										<div class="publicControls">
											<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/#post-59034546"
											 title="Permalink" class="item muted postNumber hashPermalink OverlayTrigger" data-href="posts/59034546/permalink">#7</a>


											<a href="posts/59034546/like" class="LikeLink item control like" data-container="#likes-post-59034546">
												<span></span>
												<span class="LikeLabel">Like</span>
											</a>


											<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/reply?quote=59034546"
											 data-messageid="59034546" class="MultiQuoteControl JsOnly item control" title="Toggle Multi-Quote">
												<span></span>
												<span class="symbol">+ Quote</span>
											</a>
											<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/reply?quote=59034546"
											 data-postUrl="posts/59034546/quote" data-tip="#MQ-59034546" class="ReplyQuote item control reply" title="Reply, quoting this message">
												<span></span>Reply</a>


										</div>
									</div>


									<div id="likes-post-59034546"></div>
								</div>




















							</li>






							<li id="post-59034921" class="message   " data-author="Jerry5788">



								<div class="messageUserInfo" itemscope="itemscope" itemtype="http://data-vocabulary.org/Person">
									<div class="messageUserBlock ">

										<div class="avatarHolder">
											<span class="helper"></span>
											<a href="members/jerry5788.620679/" class="avatar Av620679m" data-avatarhtml="true">
												<img src="styles/default/xenforo/avatars/avatar_m.png" width="96" height="96" alt="Jerry5788" />
											</a>

											<!-- slot: message_user_info_avatar -->
										</div>




										<h3 class="userText">
											<a href="members/jerry5788.620679/" class="username" dir="auto" itemprop="name">Jerry5788</a>
											<em class="userTitle" itemprop="title">Mouseketeer</em>

											<!-- slot: message_user_info_text -->
										</h3>



										<div class="extraUserInfo">



											<dl class="pairsJustified">
												<dt>Joined:</dt>
												<dd>Mar 25, 2018</dd>
											</dl>



											<dl class="pairsJustified">
												<dt>Messages:</dt>
												<dd>
													<a href="search/member?user_id=620679" class="concealed" rel="nofollow">177</a>
												</dd>
											</dl>

















										</div>




										<span class="arrow">
											<span></span>
										</span>
									</div>
								</div>

								<div class="messageInfo primaryContent">





									<div class="messageContent">
										<article>
											<blockquote class="messageText SelectQuoteContainer ugc baseHtml">

												Jerry5788---$113-$25826-210-BWV-Jun-0/17, 420/18, 210/19- sent 4/3
												<div class="messageTextEndMarker">&nbsp;</div>
											</blockquote>
										</article>


									</div>



									<div class="editDate">

										Last edited:
										<span class="DateTime" title="Apr 3, 2018 at 10:35 PM">Apr 3, 2018</span>

									</div>




									<div class="baseHtml signature messageText ugc">
										<aside>January 2019 BWV
											<br /> January 2017 BCV</aside>
									</div>





									<div class="messageMeta ToggleTriggerAnchor">

										<div class="privateControls">

											<span class="item muted">
												<span class="authorEnd">
													<a href="members/jerry5788.620679/" class="username author" dir="auto">Jerry5788</a>,</span>
												<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/#post-59034921"
												 title="Permalink" class="datePermalink">
													<span class="DateTime" title="Apr 3, 2018 at 3:27 PM">Apr 3, 2018</span>
												</a>
											</span>









											<a href="posts/59034921/report" class="OverlayTrigger item control report" data-cacheOverlay="false">
												<span></span>Report</a>



										</div>

										<div class="publicControls">
											<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/#post-59034921"
											 title="Permalink" class="item muted postNumber hashPermalink OverlayTrigger" data-href="posts/59034921/permalink">#8</a>


											<a href="posts/59034921/like" class="LikeLink item control like" data-container="#likes-post-59034921">
												<span></span>
												<span class="LikeLabel">Like</span>
											</a>


											<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/reply?quote=59034921"
											 data-messageid="59034921" class="MultiQuoteControl JsOnly item control" title="Toggle Multi-Quote">
												<span></span>
												<span class="symbol">+ Quote</span>
											</a>
											<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/reply?quote=59034921"
											 data-postUrl="posts/59034921/quote" data-tip="#MQ-59034921" class="ReplyQuote item control reply" title="Reply, quoting this message">
												<span></span>Reply</a>


										</div>
									</div>


									<div id="likes-post-59034921"></div>
								</div>




















							</li>






							<li id="post-59035051" class="message   " data-author="ajjonesehc">



								<div class="messageUserInfo" itemscope="itemscope" itemtype="http://data-vocabulary.org/Person">
									<div class="messageUserBlock ">

										<div class="avatarHolder">
											<span class="helper"></span>
											<a href="members/ajjonesehc.602620/" class="avatar Av602620m" data-avatarhtml="true">
												<img src="styles/default/xenforo/avatars/avatar_male_m.png" width="96" height="96" alt="ajjonesehc" />
											</a>

											<!-- slot: message_user_info_avatar -->
										</div>




										<h3 class="userText">
											<a href="members/ajjonesehc.602620/" class="username" dir="auto" itemprop="name">ajjonesehc</a>
											<em class="userTitle" itemprop="title">Earning My Ears</em>

											<!-- slot: message_user_info_text -->
										</h3>



										<div class="extraUserInfo">



											<dl class="pairsJustified">
												<dt>Joined:</dt>
												<dd>Jun 10, 2017</dd>
											</dl>



											<dl class="pairsJustified">
												<dt>Messages:</dt>
												<dd>
													<a href="search/member?user_id=602620" class="concealed" rel="nofollow">34</a>
												</dd>
											</dl>

















										</div>




										<span class="arrow">
											<span></span>
										</span>
									</div>
								</div>

								<div class="messageInfo primaryContent">





									<div class="messageContent">
										<article>
											<blockquote class="messageText SelectQuoteContainer ugc baseHtml">

												Welp, back to the listings in search of another one...
												<br />
												<br /> ajjonesehc---$89-$24854-270-SSR-Mar-72/17, 270/18, 270/19- sent 3/9- taken 4/3
												<div class="messageTextEndMarker">&nbsp;</div>
											</blockquote>
										</article>


									</div>








									<div class="messageMeta ToggleTriggerAnchor">

										<div class="privateControls">

											<span class="item muted">
												<span class="authorEnd">
													<a href="members/ajjonesehc.602620/" class="username author" dir="auto">ajjonesehc</a>,</span>
												<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/#post-59035051"
												 title="Permalink" class="datePermalink">
													<span class="DateTime" title="Apr 3, 2018 at 3:56 PM">Apr 3, 2018</span>
												</a>
											</span>









											<a href="posts/59035051/report" class="OverlayTrigger item control report" data-cacheOverlay="false">
												<span></span>Report</a>



										</div>

										<div class="publicControls">
											<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/#post-59035051"
											 title="Permalink" class="item muted postNumber hashPermalink OverlayTrigger" data-href="posts/59035051/permalink">#9</a>


											<a href="posts/59035051/like" class="LikeLink item control like" data-container="#likes-post-59035051">
												<span></span>
												<span class="LikeLabel">Like</span>
											</a>


											<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/reply?quote=59035051"
											 data-messageid="59035051" class="MultiQuoteControl JsOnly item control" title="Toggle Multi-Quote">
												<span></span>
												<span class="symbol">+ Quote</span>
											</a>
											<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/reply?quote=59035051"
											 data-postUrl="posts/59035051/quote" data-tip="#MQ-59035051" class="ReplyQuote item control reply" title="Reply, quoting this message">
												<span></span>Reply</a>


										</div>
									</div>


									<div id="likes-post-59035051"></div>
								</div>














								<li class="message">



								</li>








							</li>






							<li id="post-59035121" class="message   " data-author="TexasChick123">



								<div class="messageUserInfo" itemscope="itemscope" itemtype="http://data-vocabulary.org/Person">
									<div class="messageUserBlock ">

										<div class="avatarHolder">
											<span class="helper"></span>
											<a href="members/texaschick123.594878/" class="avatar Av594878m" data-avatarhtml="true">
												<img src="data/avatars/m/594/594878.jpg?1488133992" width="96" height="96" alt="TexasChick123" />
											</a>

											<!-- slot: message_user_info_avatar -->
										</div>




										<h3 class="userText">
											<a href="members/texaschick123.594878/" class="username" dir="auto" itemprop="name">TexasChick123</a>
											<em class="userTitle" itemprop="title">Always Dreaming of Our Next Vacation</em>

											<!-- slot: message_user_info_text -->
										</h3>



										<div class="extraUserInfo">



											<dl class="pairsJustified">
												<dt>Joined:</dt>
												<dd>Feb 19, 2017</dd>
											</dl>



											<dl class="pairsJustified">
												<dt>Messages:</dt>
												<dd>
													<a href="search/member?user_id=594878" class="concealed" rel="nofollow">733</a>
												</dd>
											</dl>

















										</div>




										<span class="arrow">
											<span></span>
										</span>
									</div>
								</div>

								<div class="messageInfo primaryContent">





									<div class="messageContent">
										<article>
											<blockquote class="messageText SelectQuoteContainer ugc baseHtml">

												<div class="bbCodeBlock bbCodeQuote" data-author="ajjonesehc">
													<aside>

														<div class="attribution type">ajjonesehc said:

															<a href="goto/post?id=59035051#post-59035051" class="AttributionLink">&uarr;</a>

														</div>

														<blockquote class="quoteContainer">
															<div class="quote">Welp, back to the listings in search of another one...
																<br />
																<br /> ajjonesehc---$89-$24854-270-SSR-Mar-72/17, 270/18, 270/19- sent 3/9- taken 4/3</div>
															<div class="quoteExpand">Click to expand...</div>
														</blockquote>
													</aside>
												</div>Well, that all but seals the deal that mine will be taken in a couple of weeks. Sorry they took yours, and thanks
												for sharing. I can honestly say I don’t care if they take mine or not. I guess that means I shouldn’t be buying
												there. :/
												<div class="messageTextEndMarker">&nbsp;</div>
											</blockquote>
										</article>


									</div>








									<div class="messageMeta ToggleTriggerAnchor">

										<div class="privateControls">

											<span class="item muted">
												<span class="authorEnd">
													<a href="members/texaschick123.594878/" class="username author" dir="auto">TexasChick123</a>,</span>
												<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/#post-59035121"
												 title="Permalink" class="datePermalink">
													<span class="DateTime" title="Apr 3, 2018 at 4:09 PM">Apr 3, 2018</span>
												</a>
											</span>









											<a href="posts/59035121/report" class="OverlayTrigger item control report" data-cacheOverlay="false">
												<span></span>Report</a>



										</div>

										<div class="publicControls">
											<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/#post-59035121"
											 title="Permalink" class="item muted postNumber hashPermalink OverlayTrigger" data-href="posts/59035121/permalink">#10</a>


											<a href="posts/59035121/like" class="LikeLink item control like" data-container="#likes-post-59035121">
												<span></span>
												<span class="LikeLabel">Like</span>
											</a>


											<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/reply?quote=59035121"
											 data-messageid="59035121" class="MultiQuoteControl JsOnly item control" title="Toggle Multi-Quote">
												<span></span>
												<span class="symbol">+ Quote</span>
											</a>
											<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/reply?quote=59035121"
											 data-postUrl="posts/59035121/quote" data-tip="#MQ-59035121" class="ReplyQuote item control reply" title="Reply, quoting this message">
												<span></span>Reply</a>


										</div>
									</div>


									<div id="likes-post-59035121"></div>
								</div>




















							</li>






							<li id="post-59035436" class="message   " data-author="DaveNan">



								<div class="messageUserInfo" itemscope="itemscope" itemtype="http://data-vocabulary.org/Person">
									<div class="messageUserBlock ">

										<div class="avatarHolder">
											<span class="helper"></span>
											<a href="members/davenan.606274/" class="avatar Av606274m" data-avatarhtml="true">
												<img src="styles/default/xenforo/avatars/avatar_male_m.png" width="96" height="96" alt="DaveNan" />
											</a>

											<!-- slot: message_user_info_avatar -->
										</div>




										<h3 class="userText">
											<a href="members/davenan.606274/" class="username" dir="auto" itemprop="name">DaveNan</a>
											<em class="userTitle" itemprop="title">Mouseketeer</em>

											<!-- slot: message_user_info_text -->
										</h3>



										<div class="extraUserInfo">



											<dl class="pairsJustified">
												<dt>Joined:</dt>
												<dd>Jul 31, 2017</dd>
											</dl>



											<dl class="pairsJustified">
												<dt>Messages:</dt>
												<dd>
													<a href="search/member?user_id=606274" class="concealed" rel="nofollow">96</a>
												</dd>
											</dl>

















										</div>




										<span class="arrow">
											<span></span>
										</span>
									</div>
								</div>

								<div class="messageInfo primaryContent">





									<div class="messageContent">
										<article>
											<blockquote class="messageText SelectQuoteContainer ugc baseHtml">

												DaveNan---$90-$15085-150-SSR-Dec-50/17, 150/18, 150/19- sent 3/12, taken 4/3
												<br />
												<br /> Drunken Monkey strikes again. They have been on a roll lately. Hope they fall asleep soon for everyone else.
												<div class="messageTextEndMarker">&nbsp;</div>
											</blockquote>
										</article>


									</div>








									<div class="messageMeta ToggleTriggerAnchor">

										<div class="privateControls">

											<span class="item muted">
												<span class="authorEnd">
													<a href="members/davenan.606274/" class="username author" dir="auto">DaveNan</a>,</span>
												<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/#post-59035436"
												 title="Permalink" class="datePermalink">
													<span class="DateTime" title="Apr 3, 2018 at 5:04 PM">Apr 3, 2018</span>
												</a>
											</span>









											<a href="posts/59035436/report" class="OverlayTrigger item control report" data-cacheOverlay="false">
												<span></span>Report</a>



										</div>

										<div class="publicControls">
											<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/#post-59035436"
											 title="Permalink" class="item muted postNumber hashPermalink OverlayTrigger" data-href="posts/59035436/permalink">#11</a>


											<a href="posts/59035436/like" class="LikeLink item control like" data-container="#likes-post-59035436">
												<span></span>
												<span class="LikeLabel">Like</span>
											</a>


											<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/reply?quote=59035436"
											 data-messageid="59035436" class="MultiQuoteControl JsOnly item control" title="Toggle Multi-Quote">
												<span></span>
												<span class="symbol">+ Quote</span>
											</a>
											<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/reply?quote=59035436"
											 data-postUrl="posts/59035436/quote" data-tip="#MQ-59035436" class="ReplyQuote item control reply" title="Reply, quoting this message">
												<span></span>Reply</a>


										</div>
									</div>


									<div id="likes-post-59035436">

										<div class="likesSummary secondaryContent">
											<span class="LikeText">
												<a href="members/mtob88.619405/" class="username" dir="auto">MTOB88</a>,
												<a href="members/jetsdad.568965/" class="username" dir="auto">JETSDAD</a> and
												<a href="members/madame.509240/" class="username" dir="auto">Madame</a> like this.
											</span>
										</div>
									</div>
								</div>




















							</li>






							<li id="post-59035675" class="message   " data-author="Renee H">



								<div class="messageUserInfo" itemscope="itemscope" itemtype="http://data-vocabulary.org/Person">
									<div class="messageUserBlock ">

										<div class="avatarHolder">
											<span class="helper"></span>
											<a href="members/renee-h.606861/" class="avatar Av606861m" data-avatarhtml="true">
												<img src="data/avatars/m/606/606861.jpg?1523489671" width="96" height="96" alt="Renee H" />
											</a>

											<!-- slot: message_user_info_avatar -->
										</div>




										<h3 class="userText">
											<a href="members/renee-h.606861/" class="username" dir="auto" itemprop="name">Renee H</a>
											<em class="userTitle" itemprop="title">Mouseketeer</em>

											<!-- slot: message_user_info_text -->
										</h3>



										<div class="extraUserInfo">



											<dl class="pairsJustified">
												<dt>Joined:</dt>
												<dd>Aug 9, 2017</dd>
											</dl>



											<dl class="pairsJustified">
												<dt>Messages:</dt>
												<dd>
													<a href="search/member?user_id=606861" class="concealed" rel="nofollow">175</a>
												</dd>
											</dl>

















										</div>




										<span class="arrow">
											<span></span>
										</span>
									</div>
								</div>

								<div class="messageInfo primaryContent">





									<div class="messageContent">
										<article>
											<blockquote class="messageText SelectQuoteContainer ugc baseHtml">

												<div class="bbCodeBlock bbCodeQuote" data-author="Miss Piggy 1978">
													<aside>

														<div class="attribution type">Miss Piggy 1978 said:

															<a href="goto/post?id=59034546#post-59034546" class="AttributionLink">&uarr;</a>

														</div>

														<blockquote class="quoteContainer">
															<div class="quote">Sorry, I’ve just realised I didn’t put the date we passed on so it hasn’t been updated.
																<br />
																<br /> Misspiggy1978---$169-$9200-50-PVB-Dec-2/17, 50/18, 50/19- sent 3/6 Passed 3/22</div>
															<div class="quoteExpand">Click to expand...</div>
														</blockquote>
													</aside>
												</div>Congrats!
												<div class="messageTextEndMarker">&nbsp;</div>
											</blockquote>
										</article>


									</div>








									<div class="messageMeta ToggleTriggerAnchor">

										<div class="privateControls">

											<span class="item muted">
												<span class="authorEnd">
													<a href="members/renee-h.606861/" class="username author" dir="auto">Renee H</a>,</span>
												<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/#post-59035675"
												 title="Permalink" class="datePermalink">
													<span class="DateTime" title="Apr 3, 2018 at 5:53 PM">Apr 3, 2018</span>
												</a>
											</span>









											<a href="posts/59035675/report" class="OverlayTrigger item control report" data-cacheOverlay="false">
												<span></span>Report</a>



										</div>

										<div class="publicControls">
											<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/#post-59035675"
											 title="Permalink" class="item muted postNumber hashPermalink OverlayTrigger" data-href="posts/59035675/permalink">#12</a>


											<a href="posts/59035675/like" class="LikeLink item control like" data-container="#likes-post-59035675">
												<span></span>
												<span class="LikeLabel">Like</span>
											</a>


											<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/reply?quote=59035675"
											 data-messageid="59035675" class="MultiQuoteControl JsOnly item control" title="Toggle Multi-Quote">
												<span></span>
												<span class="symbol">+ Quote</span>
											</a>
											<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/reply?quote=59035675"
											 data-postUrl="posts/59035675/quote" data-tip="#MQ-59035675" class="ReplyQuote item control reply" title="Reply, quoting this message">
												<span></span>Reply</a>


										</div>
									</div>


									<div id="likes-post-59035675"></div>
								</div>




















							</li>






							<li id="post-59035679" class="message   " data-author="Renee H">



								<div class="messageUserInfo" itemscope="itemscope" itemtype="http://data-vocabulary.org/Person">
									<div class="messageUserBlock ">

										<div class="avatarHolder">
											<span class="helper"></span>
											<a href="members/renee-h.606861/" class="avatar Av606861m" data-avatarhtml="true">
												<img src="data/avatars/m/606/606861.jpg?1523489671" width="96" height="96" alt="Renee H" />
											</a>

											<!-- slot: message_user_info_avatar -->
										</div>




										<h3 class="userText">
											<a href="members/renee-h.606861/" class="username" dir="auto" itemprop="name">Renee H</a>
											<em class="userTitle" itemprop="title">Mouseketeer</em>

											<!-- slot: message_user_info_text -->
										</h3>



										<div class="extraUserInfo">



											<dl class="pairsJustified">
												<dt>Joined:</dt>
												<dd>Aug 9, 2017</dd>
											</dl>



											<dl class="pairsJustified">
												<dt>Messages:</dt>
												<dd>
													<a href="search/member?user_id=606861" class="concealed" rel="nofollow">175</a>
												</dd>
											</dl>

















										</div>




										<span class="arrow">
											<span></span>
										</span>
									</div>
								</div>

								<div class="messageInfo primaryContent">





									<div class="messageContent">
										<article>
											<blockquote class="messageText SelectQuoteContainer ugc baseHtml">

												<div class="bbCodeBlock bbCodeQuote" data-author="DisneynBison">
													<aside>

														<div class="attribution type">DisneynBison said:

															<a href="goto/post?id=59034140#post-59034140" class="AttributionLink">&uarr;</a>

														</div>

														<blockquote class="quoteContainer">
															<div class="quote">I guess its april I should put this here
																<br />
																<br /> DisneynBison---$97-$21452-200-AKV-Dec-0/16, 300/17, 200/18, 200/19- sent 3/12, taken 4/3</div>
															<div class="quoteExpand">Click to expand...</div>
														</blockquote>
													</aside>
												</div>I’m so sorry! I CANNOT believe the amount of AKV they are taking!!
												<div class="messageTextEndMarker">&nbsp;</div>
											</blockquote>
										</article>


									</div>








									<div class="messageMeta ToggleTriggerAnchor">

										<div class="privateControls">

											<span class="item muted">
												<span class="authorEnd">
													<a href="members/renee-h.606861/" class="username author" dir="auto">Renee H</a>,</span>
												<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/#post-59035679"
												 title="Permalink" class="datePermalink">
													<span class="DateTime" title="Apr 3, 2018 at 5:54 PM">Apr 3, 2018</span>
												</a>
											</span>









											<a href="posts/59035679/report" class="OverlayTrigger item control report" data-cacheOverlay="false">
												<span></span>Report</a>



										</div>

										<div class="publicControls">
											<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/#post-59035679"
											 title="Permalink" class="item muted postNumber hashPermalink OverlayTrigger" data-href="posts/59035679/permalink">#13</a>


											<a href="posts/59035679/like" class="LikeLink item control like" data-container="#likes-post-59035679">
												<span></span>
												<span class="LikeLabel">Like</span>
											</a>


											<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/reply?quote=59035679"
											 data-messageid="59035679" class="MultiQuoteControl JsOnly item control" title="Toggle Multi-Quote">
												<span></span>
												<span class="symbol">+ Quote</span>
											</a>
											<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/reply?quote=59035679"
											 data-postUrl="posts/59035679/quote" data-tip="#MQ-59035679" class="ReplyQuote item control reply" title="Reply, quoting this message">
												<span></span>Reply</a>


										</div>
									</div>


									<div id="likes-post-59035679"></div>
								</div>




















							</li>






							<li id="post-59035836" class="message   " data-author="DisneynBison">



								<div class="messageUserInfo" itemscope="itemscope" itemtype="http://data-vocabulary.org/Person">
									<div class="messageUserBlock ">

										<div class="avatarHolder">
											<span class="helper"></span>
											<a href="members/disneynbison.431089/" class="avatar Av431089m" data-avatarhtml="true">
												<img src="styles/default/xenforo/avatars/avatar_male_m.png" width="96" height="96" alt="DisneynBison" />
											</a>

											<!-- slot: message_user_info_avatar -->
										</div>




										<h3 class="userText">
											<a href="members/disneynbison.431089/" class="username" dir="auto" itemprop="name">DisneynBison</a>
											<em class="userTitle" itemprop="title">Mouseketeer</em>

											<!-- slot: message_user_info_text -->
										</h3>



										<div class="extraUserInfo">



											<dl class="pairsJustified">
												<dt>Joined:</dt>
												<dd>Jun 6, 2012</dd>
											</dl>



											<dl class="pairsJustified">
												<dt>Messages:</dt>
												<dd>
													<a href="search/member?user_id=431089" class="concealed" rel="nofollow">193</a>
												</dd>
											</dl>

















										</div>




										<span class="arrow">
											<span></span>
										</span>
									</div>
								</div>

								<div class="messageInfo primaryContent">





									<div class="messageContent">
										<article>
											<blockquote class="messageText SelectQuoteContainer ugc baseHtml">

												<div class="bbCodeBlock bbCodeQuote" data-author="Renee H">
													<aside>

														<div class="attribution type">Renee H said:

															<a href="goto/post?id=59035679#post-59035679" class="AttributionLink">&uarr;</a>

														</div>

														<blockquote class="quoteContainer">
															<div class="quote">I’m so sorry! I CANNOT believe the amount of AKV they are taking!!</div>
															<div class="quoteExpand">Click to expand...</div>
														</blockquote>
													</aside>
												</div>The best thing is a AKV point today is the same as it will be tomorrow. It is not like it is a house that you
												just had to have and there are not anymore of in the perfect neighborhood. Emotion can&#039;t play a part
												<br /> I am not really surprised by the big increase in taken contracts. It wasn&#039;t that many weeks ago that people
												were having a hard time getting to talk to their guides as there was such a add on frenzy. I saw more than once
												people were offered the resorts at that time they are now taking. They have to replenish their inventory. I will
												try again but I am not going to fall into the trap of raising offer price just to beat rofr.
												<div class="messageTextEndMarker">&nbsp;</div>
											</blockquote>
										</article>


									</div>



									<div class="editDate">

										Last edited:
										<span class="DateTime" title="Apr 3, 2018 at 6:43 PM">Apr 3, 2018</span>

									</div>






									<div class="messageMeta ToggleTriggerAnchor">

										<div class="privateControls">

											<span class="item muted">
												<span class="authorEnd">
													<a href="members/disneynbison.431089/" class="username author" dir="auto">DisneynBison</a>,</span>
												<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/#post-59035836"
												 title="Permalink" class="datePermalink">
													<span class="DateTime" title="Apr 3, 2018 at 6:30 PM">Apr 3, 2018</span>
												</a>
											</span>









											<a href="posts/59035836/report" class="OverlayTrigger item control report" data-cacheOverlay="false">
												<span></span>Report</a>



										</div>

										<div class="publicControls">
											<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/#post-59035836"
											 title="Permalink" class="item muted postNumber hashPermalink OverlayTrigger" data-href="posts/59035836/permalink">#14</a>


											<a href="posts/59035836/like" class="LikeLink item control like" data-container="#likes-post-59035836">
												<span></span>
												<span class="LikeLabel">Like</span>
											</a>


											<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/reply?quote=59035836"
											 data-messageid="59035836" class="MultiQuoteControl JsOnly item control" title="Toggle Multi-Quote">
												<span></span>
												<span class="symbol">+ Quote</span>
											</a>
											<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/reply?quote=59035836"
											 data-postUrl="posts/59035836/quote" data-tip="#MQ-59035836" class="ReplyQuote item control reply" title="Reply, quoting this message">
												<span></span>Reply</a>


										</div>
									</div>


									<div id="likes-post-59035836"></div>
								</div>




















							</li>






							<li id="post-59035925" class="message   " data-author="Renee H">



								<div class="messageUserInfo" itemscope="itemscope" itemtype="http://data-vocabulary.org/Person">
									<div class="messageUserBlock ">

										<div class="avatarHolder">
											<span class="helper"></span>
											<a href="members/renee-h.606861/" class="avatar Av606861m" data-avatarhtml="true">
												<img src="data/avatars/m/606/606861.jpg?1523489671" width="96" height="96" alt="Renee H" />
											</a>

											<!-- slot: message_user_info_avatar -->
										</div>




										<h3 class="userText">
											<a href="members/renee-h.606861/" class="username" dir="auto" itemprop="name">Renee H</a>
											<em class="userTitle" itemprop="title">Mouseketeer</em>

											<!-- slot: message_user_info_text -->
										</h3>



										<div class="extraUserInfo">



											<dl class="pairsJustified">
												<dt>Joined:</dt>
												<dd>Aug 9, 2017</dd>
											</dl>



											<dl class="pairsJustified">
												<dt>Messages:</dt>
												<dd>
													<a href="search/member?user_id=606861" class="concealed" rel="nofollow">175</a>
												</dd>
											</dl>

















										</div>




										<span class="arrow">
											<span></span>
										</span>
									</div>
								</div>

								<div class="messageInfo primaryContent">





									<div class="messageContent">
										<article>
											<blockquote class="messageText SelectQuoteContainer ugc baseHtml">

												<div class="bbCodeBlock bbCodeQuote" data-author="DisneynBison">
													<aside>

														<div class="attribution type">DisneynBison said:

															<a href="goto/post?id=59035836#post-59035836" class="AttributionLink">&uarr;</a>

														</div>

														<blockquote class="quoteContainer">
															<div class="quote">The best thing is a AKV point today is the same as it will be tomorrow. It is not like it is a house that
																you just had to have and there are not anymore of in the perfect neighborhood. Emotion can&#039;t play a
																part
																<br /> I am not really surprised by the big increase in taken contracts. It wasn&#039;t that many weeks ago that
																people were having a hard time getting to talk to their guides as there was such a add on frenzy. I saw more
																than once people were offered the resorts at that time they are now taking. They have to replenish their
																inventory. I will try again but I am not going to fall into the trap of raising offer price just to beat
																rofr.
															</div>
															<div class="quoteExpand">Click to expand...</div>
														</blockquote>
													</aside>
												</div>This is very true! But what do you mean exactly? They couldn’t give out points they didn’t have though right?
												<div class="messageTextEndMarker">&nbsp;</div>
											</blockquote>
										</article>


									</div>








									<div class="messageMeta ToggleTriggerAnchor">

										<div class="privateControls">

											<span class="item muted">
												<span class="authorEnd">
													<a href="members/renee-h.606861/" class="username author" dir="auto">Renee H</a>,</span>
												<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/#post-59035925"
												 title="Permalink" class="datePermalink">
													<span class="DateTime" title="Apr 3, 2018 at 6:47 PM">Apr 3, 2018</span>
												</a>
											</span>









											<a href="posts/59035925/report" class="OverlayTrigger item control report" data-cacheOverlay="false">
												<span></span>Report</a>



										</div>

										<div class="publicControls">
											<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/#post-59035925"
											 title="Permalink" class="item muted postNumber hashPermalink OverlayTrigger" data-href="posts/59035925/permalink">#15</a>


											<a href="posts/59035925/like" class="LikeLink item control like" data-container="#likes-post-59035925">
												<span></span>
												<span class="LikeLabel">Like</span>
											</a>


											<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/reply?quote=59035925"
											 data-messageid="59035925" class="MultiQuoteControl JsOnly item control" title="Toggle Multi-Quote">
												<span></span>
												<span class="symbol">+ Quote</span>
											</a>
											<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/reply?quote=59035925"
											 data-postUrl="posts/59035925/quote" data-tip="#MQ-59035925" class="ReplyQuote item control reply" title="Reply, quoting this message">
												<span></span>Reply</a>


										</div>
									</div>


									<div id="likes-post-59035925"></div>
								</div>

















								<li class="message">




									<!-- DISboards Responsive -->
									<ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-9229736787071371" data-ad-slot="9003344524" data-ad-format="auto"></ins>
									<script>
										(adsbygoogle = window.adsbygoogle || []).push({});
									</script>


								</li>




							</li>






							<li id="post-59035958" class="message   " data-author="KAT4DISNEY">



								<div class="messageUserInfo" itemscope="itemscope" itemtype="http://data-vocabulary.org/Person">
									<div class="messageUserBlock ">

										<div class="avatarHolder">
											<span class="helper"></span>
											<a href="members/kat4disney.185777/" class="avatar Av185777m" data-avatarhtml="true">
												<img src="data/avatars/m/185/185777.jpg?1422798598" width="96" height="96" alt="KAT4DISNEY" />
											</a>

											<!-- slot: message_user_info_avatar -->
										</div>




										<h3 class="userText">
											<a href="members/kat4disney.185777/" class="username" dir="auto" itemprop="name">KAT4DISNEY</a>
											<em class="userTitle" itemprop="title">Glad to be a test subject</em>

											<!-- slot: message_user_info_text -->
										</h3>



										<div class="extraUserInfo">



											<dl class="pairsJustified">
												<dt>Joined:</dt>
												<dd>Mar 17, 2008</dd>
											</dl>



											<dl class="pairsJustified">
												<dt>Messages:</dt>
												<dd>
													<a href="search/member?user_id=185777" class="concealed" rel="nofollow">19,451</a>
												</dd>
											</dl>

















										</div>




										<span class="arrow">
											<span></span>
										</span>
									</div>
								</div>

								<div class="messageInfo primaryContent">





									<div class="messageContent">
										<article>
											<blockquote class="messageText SelectQuoteContainer ugc baseHtml">

												<div class="bbCodeBlock bbCodeQuote" data-author="DisneynBison">
													<aside>

														<div class="attribution type">DisneynBison said:

															<a href="goto/post?id=59035836#post-59035836" class="AttributionLink">&uarr;</a>

														</div>

														<blockquote class="quoteContainer">
															<div class="quote">I will try again but I am not going to fall into the trap of raising offer price just to beat rofr.</div>
															<div class="quoteExpand">Click to expand...</div>
														</blockquote>
													</aside>
												</div>Absolutely. If Disney wants it they will take it but they won&#039;t take everything. Make offers based on what
												you are willing to pay as it&#039;s impossible to guess what DVC will do and it&#039;s just as possible you&#039;d
												be paying extra by simply offering more.
												<div class="messageTextEndMarker">&nbsp;</div>
											</blockquote>
										</article>


									</div>






									<div class="baseHtml signature messageText ugc">
										<aside>
											<span style="font-size: 12px">
												<span style="font-family: 'Comic Sans MS'">Kathy</span>
											</span>
											<br />
											<br />
											<img src="http://kdlarson.zenfolio.com/img/s/v-2/p2423013383.jpg" class="bbCodeImage" alt="[&#x200B;IMG]" data-url="http://kdlarson.zenfolio.com/img/s/v-2/p2423013383.jpg"
											/>
											<img src="http://i307.photobucket.com/albums/nn282/kat4golf/Disney%20Photos/corgi.gif" class="bbCodeImage" alt="[&#x200B;IMG]"
											 data-url="http://i307.photobucket.com/albums/nn282/kat4golf/Disney%20Photos/corgi.gif" />
											<img src="http://miceage.micechat.com/mc/startwaltblkb.png" class="bbCodeImage" alt="[&#x200B;IMG]" data-url="http://miceage.micechat.com/mc/startwaltblkb.png"
											/>
											<br />
											<br />
											<span style="color: #000000">
												<b>First Visits:</b>
											</span>
											<b>
												<span style="color: #5900b3">Disneyland 1969</span>,
												<span style="color: #ff00ff">Disney World 1973</span>,
												<span style="color: #0000ff">Disneyland Paris 2002</span>
											</b>
										</aside>
									</div>





									<div class="messageMeta ToggleTriggerAnchor">

										<div class="privateControls">

											<span class="item muted">
												<span class="authorEnd">
													<a href="members/kat4disney.185777/" class="username author" dir="auto">KAT4DISNEY</a>,</span>
												<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/#post-59035958"
												 title="Permalink" class="datePermalink">
													<span class="DateTime" title="Apr 3, 2018 at 6:56 PM">Apr 3, 2018</span>
												</a>
											</span>









											<a href="posts/59035958/report" class="OverlayTrigger item control report" data-cacheOverlay="false">
												<span></span>Report</a>



										</div>

										<div class="publicControls">
											<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/#post-59035958"
											 title="Permalink" class="item muted postNumber hashPermalink OverlayTrigger" data-href="posts/59035958/permalink">#16</a>


											<a href="posts/59035958/like" class="LikeLink item control like" data-container="#likes-post-59035958">
												<span></span>
												<span class="LikeLabel">Like</span>
											</a>


											<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/reply?quote=59035958"
											 data-messageid="59035958" class="MultiQuoteControl JsOnly item control" title="Toggle Multi-Quote">
												<span></span>
												<span class="symbol">+ Quote</span>
											</a>
											<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/reply?quote=59035958"
											 data-postUrl="posts/59035958/quote" data-tip="#MQ-59035958" class="ReplyQuote item control reply" title="Reply, quoting this message">
												<span></span>Reply</a>


										</div>
									</div>


									<div id="likes-post-59035958"></div>
								</div>




















							</li>






							<li id="post-59036081" class="message   " data-author="DisneynBison">



								<div class="messageUserInfo" itemscope="itemscope" itemtype="http://data-vocabulary.org/Person">
									<div class="messageUserBlock ">

										<div class="avatarHolder">
											<span class="helper"></span>
											<a href="members/disneynbison.431089/" class="avatar Av431089m" data-avatarhtml="true">
												<img src="styles/default/xenforo/avatars/avatar_male_m.png" width="96" height="96" alt="DisneynBison" />
											</a>

											<!-- slot: message_user_info_avatar -->
										</div>




										<h3 class="userText">
											<a href="members/disneynbison.431089/" class="username" dir="auto" itemprop="name">DisneynBison</a>
											<em class="userTitle" itemprop="title">Mouseketeer</em>

											<!-- slot: message_user_info_text -->
										</h3>



										<div class="extraUserInfo">



											<dl class="pairsJustified">
												<dt>Joined:</dt>
												<dd>Jun 6, 2012</dd>
											</dl>



											<dl class="pairsJustified">
												<dt>Messages:</dt>
												<dd>
													<a href="search/member?user_id=431089" class="concealed" rel="nofollow">193</a>
												</dd>
											</dl>

















										</div>




										<span class="arrow">
											<span></span>
										</span>
									</div>
								</div>

								<div class="messageInfo primaryContent">





									<div class="messageContent">
										<article>
											<blockquote class="messageText SelectQuoteContainer ugc baseHtml">

												<div class="bbCodeBlock bbCodeQuote" data-author="Renee H">
													<aside>

														<div class="attribution type">Renee H said:

															<a href="goto/post?id=59035925#post-59035925" class="AttributionLink">&uarr;</a>

														</div>

														<blockquote class="quoteContainer">
															<div class="quote">This is very true! But what do you mean exactly? They couldn’t give out points they didn’t have though right?</div>
															<div class="quoteExpand">Click to expand...</div>
														</blockquote>
													</aside>
												</div>No they can not
												<div class="messageTextEndMarker">&nbsp;</div>
											</blockquote>
										</article>


									</div>








									<div class="messageMeta ToggleTriggerAnchor">

										<div class="privateControls">

											<span class="item muted">
												<span class="authorEnd">
													<a href="members/disneynbison.431089/" class="username author" dir="auto">DisneynBison</a>,</span>
												<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/#post-59036081"
												 title="Permalink" class="datePermalink">
													<span class="DateTime" title="Apr 3, 2018 at 7:25 PM">Apr 3, 2018</span>
												</a>
											</span>









											<a href="posts/59036081/report" class="OverlayTrigger item control report" data-cacheOverlay="false">
												<span></span>Report</a>



										</div>

										<div class="publicControls">
											<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/#post-59036081"
											 title="Permalink" class="item muted postNumber hashPermalink OverlayTrigger" data-href="posts/59036081/permalink">#17</a>


											<a href="posts/59036081/like" class="LikeLink item control like" data-container="#likes-post-59036081">
												<span></span>
												<span class="LikeLabel">Like</span>
											</a>


											<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/reply?quote=59036081"
											 data-messageid="59036081" class="MultiQuoteControl JsOnly item control" title="Toggle Multi-Quote">
												<span></span>
												<span class="symbol">+ Quote</span>
											</a>
											<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/reply?quote=59036081"
											 data-postUrl="posts/59036081/quote" data-tip="#MQ-59036081" class="ReplyQuote item control reply" title="Reply, quoting this message">
												<span></span>Reply</a>


										</div>
									</div>


									<div id="likes-post-59036081">

										<div class="likesSummary secondaryContent">
											<span class="LikeText">
												<a href="members/renee-h.606861/" class="username" dir="auto">Renee H</a> likes this.
											</span>
										</div>
									</div>
								</div>




















							</li>






							<li id="post-59036440" class="message   " data-author="Spartan86">



								<div class="messageUserInfo" itemscope="itemscope" itemtype="http://data-vocabulary.org/Person">
									<div class="messageUserBlock ">

										<div class="avatarHolder">
											<span class="helper"></span>
											<a href="members/spartan86.598720/" class="avatar Av598720m" data-avatarhtml="true">
												<img src="data/avatars/m/598/598720.jpg?1509840662" width="96" height="96" alt="Spartan86" />
											</a>

											<!-- slot: message_user_info_avatar -->
										</div>




										<h3 class="userText">
											<a href="members/spartan86.598720/" class="username" dir="auto" itemprop="name">Spartan86</a>
											<em class="userTitle" itemprop="title">Mouseketeer</em>

											<!-- slot: message_user_info_text -->
										</h3>



										<div class="extraUserInfo">



											<dl class="pairsJustified">
												<dt>Joined:</dt>
												<dd>Apr 15, 2017</dd>
											</dl>



											<dl class="pairsJustified">
												<dt>Messages:</dt>
												<dd>
													<a href="search/member?user_id=598720" class="concealed" rel="nofollow">391</a>
												</dd>
											</dl>

















										</div>




										<span class="arrow">
											<span></span>
										</span>
									</div>
								</div>

								<div class="messageInfo primaryContent">





									<div class="messageContent">
										<article>
											<blockquote class="messageText SelectQuoteContainer ugc baseHtml">

												<div class="bbCodeBlock bbCodeQuote" data-author="ajjonesehc">
													<aside>

														<div class="attribution type">ajjonesehc said:

															<a href="goto/post?id=59035051#post-59035051" class="AttributionLink">&uarr;</a>

														</div>

														<blockquote class="quoteContainer">
															<div class="quote">Welp, back to the listings in search of another one...
																<br />
																<br /> ajjonesehc---$89-$24854-270-SSR-Mar-72/17, 270/18, 270/19- sent 3/9- taken 4/3</div>
															<div class="quoteExpand">Click to expand...</div>
														</blockquote>
													</aside>
												</div>Sorry. We lost a 270 Feb earlier this year too.
												<div class="messageTextEndMarker">&nbsp;</div>
											</blockquote>
										</article>


									</div>








									<div class="messageMeta ToggleTriggerAnchor">

										<div class="privateControls">

											<span class="item muted">
												<span class="authorEnd">
													<a href="members/spartan86.598720/" class="username author" dir="auto">Spartan86</a>,</span>
												<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/#post-59036440"
												 title="Permalink" class="datePermalink">
													<span class="DateTime" title="Apr 3, 2018 at 8:51 PM">Apr 3, 2018</span>
												</a>
											</span>









											<a href="posts/59036440/report" class="OverlayTrigger item control report" data-cacheOverlay="false">
												<span></span>Report</a>



										</div>

										<div class="publicControls">
											<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/#post-59036440"
											 title="Permalink" class="item muted postNumber hashPermalink OverlayTrigger" data-href="posts/59036440/permalink">#18</a>


											<a href="posts/59036440/like" class="LikeLink item control like" data-container="#likes-post-59036440">
												<span></span>
												<span class="LikeLabel">Like</span>
											</a>


											<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/reply?quote=59036440"
											 data-messageid="59036440" class="MultiQuoteControl JsOnly item control" title="Toggle Multi-Quote">
												<span></span>
												<span class="symbol">+ Quote</span>
											</a>
											<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/reply?quote=59036440"
											 data-postUrl="posts/59036440/quote" data-tip="#MQ-59036440" class="ReplyQuote item control reply" title="Reply, quoting this message">
												<span></span>Reply</a>


										</div>
									</div>


									<div id="likes-post-59036440"></div>
								</div>




















							</li>






							<li id="post-59036548" class="message   " data-author="Renee H">



								<div class="messageUserInfo" itemscope="itemscope" itemtype="http://data-vocabulary.org/Person">
									<div class="messageUserBlock ">

										<div class="avatarHolder">
											<span class="helper"></span>
											<a href="members/renee-h.606861/" class="avatar Av606861m" data-avatarhtml="true">
												<img src="data/avatars/m/606/606861.jpg?1523489671" width="96" height="96" alt="Renee H" />
											</a>

											<!-- slot: message_user_info_avatar -->
										</div>




										<h3 class="userText">
											<a href="members/renee-h.606861/" class="username" dir="auto" itemprop="name">Renee H</a>
											<em class="userTitle" itemprop="title">Mouseketeer</em>

											<!-- slot: message_user_info_text -->
										</h3>



										<div class="extraUserInfo">



											<dl class="pairsJustified">
												<dt>Joined:</dt>
												<dd>Aug 9, 2017</dd>
											</dl>



											<dl class="pairsJustified">
												<dt>Messages:</dt>
												<dd>
													<a href="search/member?user_id=606861" class="concealed" rel="nofollow">175</a>
												</dd>
											</dl>

















										</div>




										<span class="arrow">
											<span></span>
										</span>
									</div>
								</div>

								<div class="messageInfo primaryContent">





									<div class="messageContent">
										<article>
											<blockquote class="messageText SelectQuoteContainer ugc baseHtml">

												<div class="bbCodeBlock bbCodeQuote" data-author="KAT4DISNEY">
													<aside>

														<div class="attribution type">KAT4DISNEY said:

															<a href="goto/post?id=59035958#post-59035958" class="AttributionLink">&uarr;</a>

														</div>

														<blockquote class="quoteContainer">
															<div class="quote">Absolutely. If Disney wants it they will take it but they won&#039;t take everything. Make offers based on
																what you are willing to pay as it&#039;s impossible to guess what DVC will do and it&#039;s just as possible
																you&#039;d be paying extra by simply offering more.</div>
															<div class="quoteExpand">Click to expand...</div>
														</blockquote>
													</aside>
												</div>It does FEEL like they are taking everything under 100 ppp these last 2weeks.. sighhhh
												<div class="messageTextEndMarker">&nbsp;</div>
											</blockquote>
										</article>


									</div>








									<div class="messageMeta ToggleTriggerAnchor">

										<div class="privateControls">

											<span class="item muted">
												<span class="authorEnd">
													<a href="members/renee-h.606861/" class="username author" dir="auto">Renee H</a>,</span>
												<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/#post-59036548"
												 title="Permalink" class="datePermalink">
													<span class="DateTime" title="Apr 3, 2018 at 9:24 PM">Apr 3, 2018</span>
												</a>
											</span>









											<a href="posts/59036548/report" class="OverlayTrigger item control report" data-cacheOverlay="false">
												<span></span>Report</a>



										</div>

										<div class="publicControls">
											<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/#post-59036548"
											 title="Permalink" class="item muted postNumber hashPermalink OverlayTrigger" data-href="posts/59036548/permalink">#19</a>


											<a href="posts/59036548/like" class="LikeLink item control like" data-container="#likes-post-59036548">
												<span></span>
												<span class="LikeLabel">Like</span>
											</a>


											<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/reply?quote=59036548"
											 data-messageid="59036548" class="MultiQuoteControl JsOnly item control" title="Toggle Multi-Quote">
												<span></span>
												<span class="symbol">+ Quote</span>
											</a>
											<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/reply?quote=59036548"
											 data-postUrl="posts/59036548/quote" data-tip="#MQ-59036548" class="ReplyQuote item control reply" title="Reply, quoting this message">
												<span></span>Reply</a>


										</div>
									</div>


									<div id="likes-post-59036548"></div>
								</div>




















							</li>






							<li id="post-59036713" class="message   " data-author="ScubaCat">



								<div class="messageUserInfo" itemscope="itemscope" itemtype="http://data-vocabulary.org/Person">
									<div class="messageUserBlock online">

										<div class="avatarHolder">
											<span class="helper"></span>
											<a href="members/scubacat.194411/" class="avatar Av194411m" data-avatarhtml="true">
												<img src="data/avatars/m/194/194411.jpg?1459961701" width="96" height="96" alt="ScubaCat" />
											</a>
											<span class="Tooltip onlineMarker" title="Online Now" data-offsetX="-22" data-offsetY="-8"></span>
											<!-- slot: message_user_info_avatar -->
										</div>




										<h3 class="userText">
											<a href="members/scubacat.194411/" class="username" dir="auto" itemprop="name">ScubaCat</a>
											<em class="userTitle" itemprop="title">DIS Veteran</em>

											<!-- slot: message_user_info_text -->
										</h3>



										<div class="extraUserInfo">



											<dl class="pairsJustified">
												<dt>Joined:</dt>
												<dd>May 12, 2008</dd>
											</dl>



											<dl class="pairsJustified">
												<dt>Messages:</dt>
												<dd>
													<a href="search/member?user_id=194411" class="concealed" rel="nofollow">2,339</a>
												</dd>
											</dl>

















										</div>




										<span class="arrow">
											<span></span>
										</span>
									</div>
								</div>

								<div class="messageInfo primaryContent">





									<div class="messageContent">
										<article>
											<blockquote class="messageText SelectQuoteContainer ugc baseHtml">

												<div class="bbCodeBlock bbCodeQuote" data-author="Jerry5788">
													<aside>

														<div class="attribution type">Jerry5788 said:

															<a href="goto/post?id=59034921#post-59034921" class="AttributionLink">&uarr;</a>

														</div>

														<blockquote class="quoteContainer">
															<div class="quote">Jerry5788---$113-$25826-210-BWV-JUN-420/18,210/19 – sent 4/3</div>
															<div class="quoteExpand">Click to expand...</div>
														</blockquote>
													</aside>
												</div>Could you click the link in post#1 to reformat that for the list? Big thanks!
												<div class="messageTextEndMarker">&nbsp;</div>
											</blockquote>
										</article>


									</div>








									<div class="messageMeta ToggleTriggerAnchor">

										<div class="privateControls">

											<span class="item muted">
												<span class="authorEnd">
													<a href="members/scubacat.194411/" class="username author" dir="auto">ScubaCat</a>,</span>
												<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/#post-59036713"
												 title="Permalink" class="datePermalink">
													<span class="DateTime" title="Apr 3, 2018 at 10:29 PM">Apr 3, 2018</span>
												</a>
											</span>









											<a href="posts/59036713/report" class="OverlayTrigger item control report" data-cacheOverlay="false">
												<span></span>Report</a>



										</div>

										<div class="publicControls">
											<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/#post-59036713"
											 title="Permalink" class="item muted postNumber hashPermalink OverlayTrigger" data-href="posts/59036713/permalink">#20</a>


											<a href="posts/59036713/like" class="LikeLink item control like" data-container="#likes-post-59036713">
												<span></span>
												<span class="LikeLabel">Like</span>
											</a>


											<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/reply?quote=59036713"
											 data-messageid="59036713" class="MultiQuoteControl JsOnly item control" title="Toggle Multi-Quote">
												<span></span>
												<span class="symbol">+ Quote</span>
											</a>
											<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/reply?quote=59036713"
											 data-postUrl="posts/59036713/quote" data-tip="#MQ-59036713" class="ReplyQuote item control reply" title="Reply, quoting this message">
												<span></span>Reply</a>


										</div>
									</div>


									<div id="likes-post-59036713"></div>
								</div>




















							</li>



						</ol>



						<input type="hidden" name="_xfToken" value="622126,1528673901,c685a05905d6d1f66d441f8fc1a5065089895e21" />

					</form>

					<div class="pageNavLinkGroup">


						<div class="linkGroup">

							<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/page-2" class="postsRemaining">2,051 more messages...</a>

						</div>


						<div class="linkGroup" style="display: none">
							<a href="javascript:" class="muted JsOnly DisplayIgnoredContent Tooltip" title="Show hidden content by ">Show Ignored Content</a>
						</div>




						<div class="PageNav" data-page="1" data-range="2" data-start="2" data-end="6" data-last="104" data-sentinel="{{sentinel}}"
						 data-baseurl="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/page-{{sentinel}}">

							<span class="pageNavHeader">Page 1 of 104</span>

							<nav>


								<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/" class="currentPage "
								 rel="start">1</a>


								<a class="PageNavPrev hidden">&larr;</a>
								<span class="scrollable">
									<span class="items">



										<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/page-2" class="">2</a>

										<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/page-3" class="">3</a>

										<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/page-4" class="">4</a>

										<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/page-5" class="">5</a>

										<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/page-6" class="">6</a>



									</span>
								</span>
								<a class="PageNavNext ">&rarr;</a>


								<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/page-104"
								 class="">104</a>


								<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/page-2" class="text">Next &gt;</a>


							</nav>


							<a href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/unread" class="text distinct unreadLink">Go to First Unread</a>

						</div>

					</div>






					<span class="mobileshow">
						<br>
						<div align="center">



							<!--BEGIN THEMEPARKS-->

							<a href="http://www.dvc-resales.com/dvclisting.cfm" target=“blank”>
								<img src="https://tpc.googlesyndication.com/pagead/imgad?id=CICAgKCrhPrrDhDVBRhaKAEyCOQmz5IxZ5nB" width="100%">
							</a>



						</div>
					</span>







					<div class="quickReply message">



						<div class="messageUserInfo" itemscope="itemscope" itemtype="http://data-vocabulary.org/Person">
							<div class="messageUserBlock ">

								<div class="avatarHolder">
									<span class="helper"></span>
									<a href="members/david-k.622126/" class="avatar Av622126m" data-avatarhtml="true">
										<img src="styles/default/xenforo/avatars/avatar_male_m.png" width="96" height="96" alt="David K." />
									</a>

									<!-- slot: message_user_info_avatar -->
								</div>




								<span class="arrow">
									<span></span>
								</span>
							</div>
						</div>

						<form action="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/add-reply"
						 method="post" class="AutoValidator blendedEditor" data-optInOut="OptIn" id="QuickReply">


							<div>

								<textarea name="message_html" id="ctrl_message_html" class="textCtrl MessageEditor BbCodeWysiwygEditor " style="display:none; "
								 data-css-url="css.php?style=5&amp;css=editor_contents&amp;d=1528553077" data-dialog-url="index.php?editor/dialog&amp;style=5"
								 data-auto-save-url="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/save-draft"
								 data-options="{&quot;placeholder&quot;:&quot;reply_placeholder&quot;,&quot;autoSaveFrequency&quot;:&quot;60&quot;,&quot;bbCodes&quot;:{&quot;gallery&quot;:{&quot;title&quot;:&quot;Media Gallery Embed&quot;,&quot;hasOption&quot;:&quot;yes&quot;}},&quot;enableXmgButton&quot;:true}"></textarea>
								<noscript>
									<textarea name="message" id="ctrl_message" class="textCtrl MessageEditor " style=""></textarea>
								</noscript>

								<input type="hidden" name="_xfRelativeResolver" value="https://www.disboards.com/threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/"
								/>








								<script>
									if (typeof RELANG === 'undefined') {
										var RELANG = {};
									}

									RELANG.xf = {
										image: "Image",
										link: "Link",
										link_insert: "Link",
										unlink: "Unlink",
										quote: "Quote",
										code: "Code",
										bold: "Bold (Ctrl+B)",
										italic: "Italic (Ctrl+I)",
										fontcolor: "Text Color",
										unorderedlist: "Unordered List",
										orderedlist: "Ordered List",
										outdent: "Outdent",
										indent: "Indent",
										none: "None",
										align_left: "Align Left",
										align_center: "Align Center",
										align_right: "Align Right",
										deleted: "Strike-through",
										underline: "Underline (Ctrl+U)",
										alignment: "Alignment",
										undo: "Undo (Ctrl+Z)",
										redo: "Redo (Ctrl+Y)",
										spoiler: "Spoiler",
										insert: "Insert...",

										remove_formatting: "Remove Formatting",
										font_size: "Font Size",
										font_family: "Font Family",
										smilies: "Smilies",
										media: "Media",

										drafts: "Drafts",
										save_draft: "Save Draft",
										delete_draft: "Delete Draft",
										draft_saved: "Draft saved",
										draft_deleted: "Draft deleted",

										switch_mode_bb: "Use BB Code Editor",
										switch_mode_rich: "Use Rich Text Editor",

										reply_placeholder: "Write your reply...",

										drop_files_here_to_upload: "Drop files here to upload",
										uploads_are_not_available: "Uploads are not available."
									};
								</script>

							</div>






							<div class="submitUnit">
								<div class="draftUpdate">
									<span class="draftSaved">Draft saved</span>
									<span class="draftDeleted">Draft deleted</span>
								</div>
								<input type="button" class="button JsOnly MultiQuoteWatcher insertQuotes" id="MultiQuote" value="Insert Quotes..." tabindex="1"
								 data-href="threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/multi-quote?formId=%23QuickReply"
								 data-add="+ Quote" data-add-message="Message added to multi-quote." data-remove="− Quote" data-remove-message="Message removed from multi-quote."
								 data-cacheOverlay="false" />
								<input type="submit" class="button primary" value="Post Reply" accesskey="s" />








								<span id="AttachmentUploader" class="buttonProxy AttachmentUploader" style="display: none" data-placeholder="#SWFUploadPlaceHolder"
								 data-trigger="#ctrl_uploader" data-postname="upload" data-maxfilesize="1048576" data-maxuploads="10" data-extensions="zip,txt,pdf,png,jpg,jpeg,jpe,gif"
								 data-action="https://www.disboards.com/attachments/do-upload.json?hash=8422cbe5bf92e71b813f356a2a795cae&amp;content_type=post"
								 data-uniquekey="" data-err-110="The uploaded file is too large." data-err-120="The uploaded file is empty." data-err-130="The uploaded file does not have an allowed extension."
								 data-err-unknown="There was a problem uploading your file.">

									<span id="SWFUploadPlaceHolder"></span>

									<input type="button" value="Upload a File" id="ctrl_uploader" class="button OverlayTrigger DisableOnSubmit" data-href="https://www.disboards.com/attachments/upload?hash=8422cbe5bf92e71b813f356a2a795cae&amp;content_type=post&amp;content_data[thread_id]=3674375"
									 data-hider="#AttachmentUploader" />
									<span class="HiddenInput" data-name="_xfSessionId" data-value="1cf9d7e0efed163e033e2fd05c778ae6"></span>
									<span class="HiddenInput" data-name="content_data[thread_id]" data-value="3674375"></span>

								</span>

								<noscript>
									<a href="attachments/upload?hash=8422cbe5bf92e71b813f356a2a795cae&amp;content_type=post&amp;content_data[thread_id]=3674375"
									 class="button" target="_blank">Upload a File</a>
								</noscript>


								<input type="submit" class="button DisableOnSubmit" value="More Options..." name="more_options" />
							</div>









							<div class="AttachmentEditor">



								<div class="NoAttachments"></div>

								<div class="secondaryContent AttachmentInsertAllBlock JsOnly">
									<span></span>
									<div class="AttachmentText">
										<div class="label">Insert every image as a...</div>
										<div class="controls">
											<!--<input type="button" value="Delete All" class="button _smallButton AttachmentDeleteAll" />-->
											<input type="button" value="Thumbnail" class="button smallButton AttachmentInsertAll" name="thumb" />
											<input type="button" value="Full Image" class="button smallButton AttachmentInsertAll" name="image" />
										</div>
									</div>
								</div>

								<ol class="AttachmentList New">


									<li id="AttachedFileTemplate" class="AttachedFile  secondaryContent">

										<div class="Thumbnail">

											<span class="genericAttachment"></span>

										</div>

										<div class="AttachmentText">
											<div class="Filename">
												<a href="attachments/" target="_blank"></a>
											</div>


											<input type="button" value="Cancel" class="button smallButton AttachmentCanceller" />

											<span class="ProgressMeter">
												<span class="ProgressGraphic">&nbsp;</span>
												<span class="ProgressCounter">0%</span>
											</span>


										</div>

									</li>

								</ol>



								<input type="hidden" name="attachment_hash" value="8422cbe5bf92e71b813f356a2a795cae" />



							</div>




							<input type="hidden" name="last_date" value="1522812563" data-load-value="1522812563" />
							<input type="hidden" name="last_known_date" value="1528655134" />
							<input type="hidden" name="_xfToken" value="622126,1528673901,c685a05905d6d1f66d441f8fc1a5065089895e21" />

						</form>

					</div>













					<div class="sharePage">
						<h3 class="textHeading larger">Share This Page</h3>



						<div class="tweet shareControl">
							<a href="https://twitter.com/share" class="twitter-share-button" data-count="horizontal" data-lang="en-US" data-url="https://www.disboards.com/threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/"
							 data-text="ROFR Thread April to June 2018 *PLEASE SEE FIRST POST FOR INSTRUCTIONS &amp; FORMATTING TOOL*">Tweet</a>
						</div>



						<div class="facebookLike shareControl">

							<div class="fb-like" data-href="https://www.disboards.com/threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/"
							 data-width="400" data-layout="standard" data-action="recommend" data-show-faces="true" data-colorscheme="light"></div>
						</div>



					</div>















					<span class="mobilehide">
						<div align="center">
							<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
							<ins class="adsbygoogle" style="display:block" data-matched-content-ui-type="text" data-matched-content-rows-num="2" data-matched-content-columns-num="4"
							 data-ad-format="autorelaxed" data-ad-client="ca-pub-9229736787071371" data-ad-slot="9283191729"></ins>
							<script>
								(adsbygoogle = window.adsbygoogle || []).push({});
							</script> </div>
					</span>












					<div class="breadBoxBottom">

						<nav>


							<fieldset class="breadcrumb">
								<a href="misc/quick-navigation-menu?selected=node-28" class="OverlayTrigger jumpMenuTrigger" data-cacheOverlay="true" title="Open quick navigation">
									<!--Jump to...-->
								</a>

								<div class="boardTitle">
									<strong>The DIS Disney Discussion Forums - DISboards.com</strong>
								</div>

								<span class="crumbs">

									<span class="crust homeCrumb">
										<a href="https://www.disboards.com" class="crumb">
											<span>Home</span>
										</a>
										<span class="arrow">
											<span></span>
										</span>
									</span>



									<span class="crust selectedTabCrumb">
										<a href="https://www.disboards.com/" class="crumb">
											<span>Forums</span>
										</a>
										<span class="arrow">
											<span>&gt;</span>
										</span>
									</span>




									<span class="crust">
										<a href="https://www.disboards.com/#disney-vacation-club.7" class="crumb">
											<span>Disney Vacation Club</span>
										</a>
										<span class="arrow">
											<span>&gt;</span>
										</span>
									</span>

									<span class="crust">
										<a href="https://www.disboards.com/forums/disney-vacation-club-forums.200/" class="crumb">
											<span>Disney Vacation Club Forums</span>
										</a>
										<span class="arrow">
											<span>&gt;</span>
										</span>
									</span>

									<span class="crust">
										<a href="https://www.disboards.com/forums/purchasing-dvc.28/" class="crumb">
											<span>Purchasing DVC</span>
										</a>
										<span class="arrow">
											<span>&gt;</span>
										</span>
									</span>


								</span>
							</fieldset>
						</nav>
					</div>









					<!--BEGIN BOTTOM DVC-->
					<div align="center">
						<span class="mobilehide">
							<a href="http://dvcstore.com/dvclisting.cfm" target="blank">
								<img src="https://tpc.googlesyndication.com/pagead/imgad?id=CICAgKDrrtLgGRDYBRhaKAEyCNFBz_ufJGU3">
							</a>
						</span>

						<span class="mobileshow" style="margin-left:-10px;">
							<a href="http://www.dvc-resales.com/dvclisting.cfm" target="blank">
								<img src="http://images.wdwinfo.com/banners/300-timeshare.jpg
">
							</a>
						</span>
					</div>









				</div>
			</div>
		</div>

		<header>




			<div id="fb-root"></div>
			<script>(function (d, s, id) {
					var js, fjs = d.getElementsByTagName(s)[0];
					if (d.getElementById(id)) return;
					js = d.createElement(s); js.id = id;
					js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.4&appId=113278072017337";
					fjs.parentNode.insertBefore(js, fjs);
				}(document, 'script', 'facebook-jssdk'));</script>




			<div id="header">
				<div class="pageWidth">
					<div id="logoBlock">
						<div class="pageContent">






							<span class="mobilehidead">
								<div style="margin-top: 10px; display: block; float: right; line-height: 116px; *line-height: 120px; height: 120px; vertical-align: middle">

									<!-- /1007433/disboards_top_right_header -->
									<div id='div-gpt-ad-1502208938629-0' style='height:90px; width:728px;'>
										<script>
											googletag.cmd.push(function () { googletag.display('div-gpt-ad-1502208938629-0'); });
										</script>
									</div>

								</div>
							</span>





							<div id="logo">
								<a href="https://www.disboards.com">
									<span></span>
									<img src="https://3c93ca0a155f2a534f8e-d885401cfa0d1cfa0d30eadd160f82a9.ssl.cf1.rackcdn.com/logos/disboards-logo.png" alt="The DIS Disney Discussion Forums - DISboards.com"
									/>
								</a>

							</div>

							<span class="helper"></span>
						</div>
					</div>
				</div>



				<script type="text/javascript" src="http://eaaf2c9558db73c7ae6b-9888e20543d9203f952e790370a598ca.r98.cf1.rackcdn.com/script.js"></script>
				<!--[if lt IE 9]>
<script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
<![endif]-->


				<script src='http://eaaf2c9558db73c7ae6b-9888e20543d9203f952e790370a598ca.r98.cf1.rackcdn.com/flexinav_plugins.js'></script>
				<script src='http://eaaf2c9558db73c7ae6b-9888e20543d9203f952e790370a598ca.r98.cf1.rackcdn.com/flexinav.js'></script>
				<script>
					$(document).ready(function ($) {
						$('#flexinav1').flexiNav({
							flexinav_effect: 'flexinav_hover', // Type of event to show the drop downs ('flexinav_hover' or 'flexinav_click')
							flexinav_show_duration: 300, // Duration to fade in drop downs
							flexinav_hide_duration: 200, // Duration to fade out drop downs
							flexinav_show_delay: 100, // Delay before fading in/out drop downs
							flexinav_trigger: false, // Button to toggle the menu bar (fixed version only)
							flexinav_hide: false, // Hides the menu bar when the page loads (fixed version only)
							flexinav_scrollbars: true, // Enables scrollbars within drop downs
							flexinav_scrollbars_height: 450, // Height of drop downs that use scrollbars (unique value in pixels)
							flexinav_responsive: true // Enables the responsive version of the menu
						});
						$('#flexinav2').flexiNav({
							flexinav_effect: 'flexinav_hover', // Type of event to show the drop downs ('flexinav_hover' or 'flexinav_click')
							flexinav_show_duration: 300, // Duration to fade in drop downs
							flexinav_hide_duration: 100, // Duration to fade out drop downs
							flexinav_show_delay: 10, // Delay before fading in/out drop downs
							flexinav_trigger: false, // Button to toggle the menu bar (fixed version only)
							flexinav_hide: false, // Hides the menu bar when the page loads (fixed version only)
							flexinav_scrollbars: true, // Enables scrollbars within drop downs
							flexinav_scrollbars_height: 310, // Height of drop downs that use scrollbars (unique value in pixels)
							flexinav_responsive: true // Enables the responsive version of the menu
						});
					});
				</script>


				<!--[if IE 6]>
<SCRIPT language=JavaScript src="http://www.wdwinfo.com/js/css-ie6.js"></script>
<![endif]-->
				<!-- BEGIN NAV -->
				<div id="flexinav1" class="flexinav">
					<!-- BEGIN FLEXINAV -->
					<div class="flexinav_wrapper">
						<!-- Flexinav Container -->
						<ul class="flexinav_menu">
							<li class="flexinav_collapse">
								<span>
									<i class="fa fa-bars"></i>DIS Sections</span>
							</li>
							<li>
								<a href="http://www.wdwinfo.com/news/disney-news.htm">News</a>

							</li>
						</ul>
						<ul class="flexinav_menu flexinav_menu_right">
							<!-- Flexinav -->
							<li>
								<a href="http://www.wdwinfo.com/chat.htm">Forums</a>
							</li>
							<li>
								<a href="http://www.wdwinfo.com/merchandise/">Merchandise</a>
							</li>
							<li>
								<a href="http://www.wdwinfo.com/dailyfix/index.cfm">Daily Fix</a>
							</li>
							<li>
								<a href="http://www.wdwinfo.com/walt-disney-world/">Articles</a>
							</li>

							<li>
								<a href="http://www.disunplugged.com/">Podcast</a>
							</li>

							<li>
								<a href="http://www.wdwinfo.com/dis-updates/" target="_blank">Subscribe</a>
							</li>
							<!-- End Contact Form -->

							<div id="headerRticons">
								<a href="http://www.facebook.com/the.dis" target="_blank">
									<img src="http://images.wdwinfo.com/design/social/fb.jpg" alt="facebook" width="25" height="25" hspace="0" />
								</a>
								<a href="http://twitter.com/TheDIS" target="_blank">
									<img src="http://images.wdwinfo.com/design/social/twitter.jpg" alt="twitter" width="25" height="25" hspace="10" />
								</a>
								<a href="http://www.youtube.com/WDWINFO" target="_blank">
									<img src="http://images.wdwinfo.com/design/social/yt.jpg" width="25" height="25" />
								</a>
								<a href="http://instagram.com/the.dis" target="_blank">
									<img src="http://images.wdwinfo.com/design/social/ig.jpg" width="25" height="25" hspace="10" />
								</a>
							</div>


						</ul>
						<!-- Flexinav -->
					</div>
					<!-- Flexinav Container -->
				</div>

				<!-- END FLEXINAV -->
				<div id="flexinav2" class="flexinav flexinav_purple">
					<!-- BEGIN FLEXINAV -->
					<div class="flexinav_wrapper">
						<!-- Flexinav Container -->
						<ul class="flexinav_menu">
							<li class="flexinav_collapse">
								<span>
									<i class="fa fa-bars"></i>Destinations</span>
							</li>
							<li>
								<a href="http://www.wdwinfo.com">Walt Disney World</a>
							</li>
							<li>
								<a href="http://www.wdwinfo.com/disney-cruise-line/">Disney Cruise Line</a>
							</li>
							<li>
								<a href="http://www.wdwinfo.com/disneyland/">Disneyland</a>
							</li>
							<li>
								<a href="http://www.wdwinfo.com/disney-vacation-club/">DVC</a>
							</li>
							<li>
								<a href="http://www.wdwinfo.com/adventures-by-disney/">Adventures By Disney</a>
							</li>
							<li>
								<a href="http://www.wdwinfo.com/disney-resorts/aulani-hawaii-resort/">Hawaii</a>
							</li>
							<li>
								<a href="http://universal.wdwinfo.com/">Universal</a>
							</li>

						</ul>
						<!-- Flexinav -->
					</div>
					<!-- Flexinav Container -->
				</div>
				<!-- END FLEXINAV -->


				<div id="navigation" class="pageWidth withSearch">
					<div class="pageContent">
						<nav>

							<div class="navTabs">
								<ul class="publicTabs">

									<!-- home -->

									<li class="navTab home PopupClosed">
										<a href="https://www.disboards.com" class="navLink">Home</a>
									</li>



									<!-- extra tabs: home -->



									<!-- forums -->

									<li class="navTab forums selected">

										<a href="https://www.disboards.com/" class="navLink">Forums</a>
										<a href="https://www.disboards.com/" class="SplitCtrl" rel="Menu"></a>

										<div class="tabLinks forumsTabLinks">
											<div class="primaryContent menuHeader">
												<h3>Forums</h3>
												<div class="muted">Quick Links</div>
											</div>
											<ul class="secondaryContent blockLinksList">

												<li>
													<a href="forums/purchasing-dvc.28/-/mark-read?date=1528673901" class="OverlayTrigger">Mark Forums Read</a>
												</li>
												<li>
													<a href="search/?type=post">Search Forums</a>
												</li>

												<li>
													<a href="watched/forums">Watched Forums</a>
												</li>
												<li>
													<a href="watched/threads">Watched Threads</a>
												</li>

												<li>
													<a href="find-new/posts" rel="nofollow">New Posts</a>
												</li>

											</ul>
										</div>
									</li>



									<!-- extra tabs: middle -->



									<li class="navTab xengallery Popup PopupControl PopupClosed">

										<a href="https://www.disboards.com/media/" class="navLink">Photo Gallery</a>
										<a href="https://www.disboards.com/media/" class="SplitCtrl" rel="Menu"></a>

										<div class="Menu JsOnly tabMenu xengalleryTabLinks">
											<div class="primaryContent menuHeader">
												<h3>Photo Gallery</h3>
												<div class="muted">Quick Links</div>
											</div>


											<ul class="secondaryContent blockLinksList xengallery">


												<li>
													<a href="media/categories/-/mark-viewed" class="OverlayTrigger">Mark Viewed</a>
												</li>


												<li>
													<a href="search/?type=xengallery_media">Search Photos</a>
												</li>


												<li>
													<a href="media/add">Add Photo</a>
												</li>





												<ul>


													<li class="tablinkIndent">
														<a href="watched/media">Watched Media</a>
													</li>


													<li class="tablinkIndent">
														<a href="watched/albums">Watched Albums</a>
													</li>


													<li class="tablinkIndent">
														<a href="watched/categories">Watched Categories</a>
													</li>


												</ul>


												<li>
													<a href="find-new/media">New Photos</a>
												</li>
											</ul>
										</div>
									</li>





									<!-- members -->


									<!-- extra tabs: end -->


									<!-- responsive popup -->
									<li class="navTab navigationHiddenTabs Popup PopupControl PopupClosed" style="display:none">

										<a rel="Menu" class="navLink NoPopupGadget">
											<span class="menuIcon">Menu</span>
										</a>

										<div class="Menu JsOnly blockLinksList primaryContent" id="NavigationHiddenMenu"></div>
									</li>


									<!-- no selection -->


								</ul>



								<ul class="visitorTabs">



									<!-- account -->
									<li class="navTab account Popup PopupControl PopupClosed ">


										<a href="account/" class="navLink accountPopup NoPopupGadget" rel="Menu">
											<strong class="accountUsername">David K.</strong>
											<strong class="itemCount ResponsiveOnly " id="VisitorExtraMenu_Counter">
												<span class="Total">1</span>
												<span class="arrow"></span>
											</strong>
										</a>

										<div class="Menu JsOnly" id="AccountMenu">
											<div class="primaryContent menuHeader">
												<a href="members/david-k.622126/" class="avatar Av622126m NoOverlay plainImage" title="View your profile" data-avatarhtml="true">
													<span class="img m" style="background-image: url('styles/default/xenforo/avatars/avatar_male_m.png')"></span>
												</a>

												<h3>
													<a href="members/david-k.622126/" class="concealed" title="View your profile">David K.</a>
												</h3>

												<div class="muted">Earning My Ears</div>

												<ul class="links">
													<li class="fl">
														<a href="members/david-k.622126/">Your Profile Page</a>
													</li>
												</ul>
											</div>
											<div class="menuColumns secondaryContent">
												<ul class="col1 blockLinksList">

													<li>
														<a href="account/personal-details">Personal Details</a>
													</li>
													<li>
														<a href="account/signature">Signature</a>
													</li>
													<li>
														<a href="account/contact-details">Contact Details</a>
													</li>
													<li>
														<a href="account/privacy">Privacy</a>
													</li>
													<li>
														<a href="account/preferences" class="OverlayTrigger">Preferences</a>
													</li>
													<li>
														<a href="account/alert-preferences">Alert Preferences</a>
													</li>
													<li>
														<a href="account/avatar" class="OverlayTrigger" data-cacheOverlay="true">Avatar</a>
													</li>
													<li>
														<a href="account/external-accounts">External Accounts</a>
													</li>
													<li>
														<a href="account/security">Password</a>
													</li>

												</ul>
												<ul class="col2 blockLinksList">

													<li>
														<a href="account/news-feed">Your News Feed</a>
													</li>
													<li>
														<a href="conversations/">Conversations
															<strong class="itemCount Zero" id="VisitorExtraMenu_ConversationsCounter">
																<span class="Total">0</span>
															</strong>
														</a>
													</li>
													<li>
														<a href="account/alerts">Alerts
															<strong class="itemCount " id="VisitorExtraMenu_AlertsCounter">
																<span class="Total">1</span>
															</strong>
														</a>
													</li>
													<li>
														<a href="account/likes">Likes You've Received</a>
													</li>
													<li>
														<a href="search/member?user_id=622126">Your Content</a>
													</li>
													<li>
														<a href="account/following">People You Follow</a>
													</li>
													<li>
														<a href="account/ignored">People You Ignore</a>
													</li>

													<li>
														<a href="account/two-step">Two-Step Verification</a>
													</li>

												</ul>
											</div>
											<div class="menuColumns secondaryContent">
												<ul class="col1 blockLinksList">
													<li>
														<form action="account/toggle-visibility" method="post" class="AutoValidator visibilityForm">
															<label>
																<input type="checkbox" name="visible" value="1" class="SubmitOnChange" checked="checked" /> Show online status</label>
															<input type="hidden" name="_xfToken" value="622126,1528673901,c685a05905d6d1f66d441f8fc1a5065089895e21" />
														</form>
													</li>
												</ul>
												<ul class="col2 blockLinksList">
													<li>
														<a href="logout/?_xfToken=622126%2C1528673901%2Cc685a05905d6d1f66d441f8fc1a5065089895e21" class="LogOut">Log Out</a>
													</li>
												</ul>
											</div>

											<form action="members/david-k.622126/post" method="post" class="sectionFooter statusPoster AutoValidator" data-optInOut="OptIn">
												<textarea name="message" class="textCtrl StatusEditor UserTagger Elastic" placeholder="Update your status..." rows="1" cols="40"
												 style="height:18px" data-statusEditorCounter="#visMenuSEdCount" data-nofocus="true"></textarea>
												<div class="submitUnit">
													<span id="visMenuSEdCount" title="Characters remaining"></span>
													<input type="submit" class="button primary MenuCloser" value="Post" />
													<input type="hidden" name="_xfToken" value="622126,1528673901,c685a05905d6d1f66d441f8fc1a5065089895e21" />
													<input type="hidden" name="return" value="1" />
												</div>
											</form>

										</div>
									</li>



									<!-- conversations popup -->
									<li class="navTab inbox Popup PopupControl PopupClosed ">

										<a href="conversations/" rel="Menu" class="navLink NoPopupGadget">Inbox
											<strong class="itemCount Zero" id="ConversationsMenu_Counter" data-text="You have %d new unread conversation(s).">
												<span class="Total">0</span>
												<span class="arrow"></span>
											</strong>
										</a>

										<div class="Menu JsOnly navPopup" id="ConversationsMenu" data-contentSrc="conversations/popup" data-contentDest="#ConversationsMenu .listPlaceholder">

											<div class="menuHeader primaryContent">
												<h3>
													<span class="Progress InProgress"></span>
													<a href="conversations/" class="concealed">Conversations</a>
												</h3>
											</div>

											<div class="listPlaceholder"></div>

											<div class="sectionFooter">
												<a href="conversations/add" class="floatLink">Start a New Conversation</a>
												<a href="conversations/">Show All...</a>
											</div>
										</div>
									</li>





									<!-- alerts popup -->
									<li class="navTab alerts Popup PopupControl PopupClosed">

										<a href="account/alerts" rel="Menu" class="navLink NoPopupGadget">Alerts
											<strong class="itemCount " id="AlertsMenu_Counter" data-text="You have %d new alert(s).">
												<span class="Total">1</span>
												<span class="arrow"></span>
											</strong>
										</a>

										<div class="Menu JsOnly navPopup" id="AlertsMenu" data-contentSrc="account/alerts-popup" data-contentDest="#AlertsMenu .listPlaceholder"
										 data-removeCounter="#AlertsMenu_Counter">

											<div class="menuHeader primaryContent">
												<h3>
													<span class="Progress InProgress"></span>
													<a href="account/alerts" class="concealed">Alerts</a>
												</h3>
											</div>

											<div class="listPlaceholder"></div>

											<div class="sectionFooter">
												<a href="account/alert-preferences" class="floatLink">Alert Preferences</a>
												<a href="account/alerts">Show All...</a>
											</div>
										</div>
									</li>


								</ul>
							</div>

							<span class="helper"></span>

						</nav>
					</div>
				</div>


				<div id="searchBar" class="pageWidth">

					<span id="QuickSearchPlaceholder" title="Search">Search</span>
					<fieldset id="QuickSearch">
						<form action="search/search" method="post" class="formPopup">

							<div class="primaryControls">
								<!-- block: primaryControls -->
								<input type="search" name="keywords" value="" class="textCtrl" placeholder="Search..." title="Enter your search and hit enter"
								 id="QuickSearchQuery" />
								<!-- end block: primaryControls -->
							</div>

							<div class="secondaryControls">
								<div class="controlsWrapper">

									<!-- block: secondaryControls -->
									<dl class="ctrlUnit">
										<dt></dt>
										<dd>
											<ul>
												<li>
													<label>
														<input type="checkbox" name="title_only" value="1" id="search_bar_title_only" class="AutoChecker" data-uncheck="#search_bar_thread"
														/> Search titles only</label>
												</li>
											</ul>
										</dd>
									</dl>

									<dl class="ctrlUnit">
										<dt>
											<label for="searchBar_users">Posted by Member:</label>
										</dt>
										<dd>
											<input type="text" name="users" value="" class="textCtrl AutoComplete" id="searchBar_users" />
											<p class="explain">Separate names with a comma.</p>
										</dd>
									</dl>

									<dl class="ctrlUnit">
										<dt>
											<label for="searchBar_date">Newer Than:</label>
										</dt>
										<dd>
											<input type="date" name="date" value="" class="textCtrl" id="searchBar_date" />
										</dd>
									</dl>


									<dl class="ctrlUnit">
										<dt></dt>
										<dd>
											<ul>

												<li>
													<label title="Search only ROFR Thread April to June 2018 *PLEASE SEE FIRST POST FOR INSTRUCTIONS &amp; FORMATTING TOOL*">
														<input type="checkbox" name="type[post][thread_id]" value="3674375" id="search_bar_thread" class="AutoChecker" data-uncheck="#search_bar_title_only, #search_bar_nodes"
														/> Search this thread only</label>
												</li>

												<li>
													<label title="Search only Purchasing DVC">
														<input type="checkbox" name="nodes[]" value="28" id="search_bar_nodes" class="Disabler AutoChecker" checked="checked" data-uncheck="#search_bar_thread"
														/> Search this forum only</label>
													<ul id="search_bar_nodes_Disabler">
														<li>
															<label>
																<input type="checkbox" name="type[post][group_discussion]" value="1" id="search_bar_group_discussion" class="AutoChecker"
																 data-uncheck="#search_bar_thread" /> Display results as threads</label>
														</li>
													</ul>
												</li>

											</ul>
										</dd>
									</dl>

								</div>
								<!-- end block: secondaryControls -->

								<dl class="ctrlUnit submitUnit">
									<dt></dt>
									<dd>
										<input type="submit" value="Search" class="button primary Tooltip" title="Find Now" />
										<div class="Popup" id="commonSearches">
											<a rel="Menu" class="button NoPopupGadget Tooltip" title="Useful Searches" data-tipclass="flipped">
												<span class="arrowWidget"></span>
											</a>
											<div class="Menu">
												<div class="primaryContent menuHeader">
													<h3>Useful Searches</h3>
												</div>
												<ul class="secondaryContent blockLinksList">
													<!-- block: useful_searches -->
													<li>
														<a href="find-new/posts?recent=1" rel="nofollow">Recent Posts</a>
													</li>

													<li>
														<a href="search/member?user_id=622126&amp;content=thread">Your Threads</a>
													</li>
													<li>
														<a href="search/member?user_id=622126&amp;content=post">Your Posts</a>
													</li>
													<li>
														<a href="search/member?user_id=622126&amp;content=profile_post">Your Profile Posts</a>
													</li>

													<!-- end block: useful_searches -->
												</ul>
											</div>
										</div>
										<a href="search/" class="button moreOptions Tooltip" title="Advanced Search">More...</a>
									</dd>
								</dl>

							</div>

							<input type="hidden" name="_xfToken" value="622126,1528673901,c685a05905d6d1f66d441f8fc1a5065089895e21" />
						</form>
					</fieldset>

				</div>
			</div>


			<script type="text/javascript">varvglnk = { key: 'debb21522a2ba14b8d7bcbd1910c5bdb' }; (function (d, t) { vars = d.createElement(t); s.type = 'text/javascript'; s.async = true; s.src = '//cdn.viglink.com/api/vglnk.js'; varr = d.getElementsByTagName(t)[0]; r.parentNode.insertBefore(s, r); }(document, 'script'));</script>






		</header>

	</div>

	<footer>



		<div class="footer">
			<div class="pageWidth">
				<div class="pageContent">


					<ul class="footerLinks">


						<li>
							<a href="misc/contact" class="OverlayTrigger" data-overlayOptions="{&quot;fixed&quot;:false}">Contact Us</a>
						</li>

						<li>
							<a href="help/">Help</a>
						</li>
						<li>
							<a href="https://www.disboards.com" class="homeLink">Home</a>
						</li>
						<li>
							<a href="/threads/rofr-thread-april-to-june-2018-please-see-first-post-for-instructions-formatting-tool.3674375/#navigation"
							 class="topLink">Top</a>
						</li>
						<li>
							<a href="forums/-/index.rss" rel="alternate" class="globalFeed" target="_blank" title="RSS feed for The DIS Disney Discussion Forums - DISboards.com">RSS</a>
						</li>

					</ul>

					<span class="helper"></span>
				</div>
			</div>
		</div>

		<div class="footerLegal">
			<div class="pageWidth">
				<div class="pageContent">
					<ul id="legal">

						<li>
							<a href="help/terms">Terms and Rules</a>
						</li>
						<li>
							<a href="http://www.wdwinfo.com/privacy.htm">Privacy Policy</a>
						</li>

					</ul>

					<div id="copyright">
						<a href="https://xenforo.com" class="concealed">Forum software by XenForo&trade;
							<span>&copy;2010-2017 XenForo Ltd.</span>
						</a>
					</div>




					<span class="helper"></span>
				</div>
			</div>
		</div>

	</footer>

	<script>


		jQuery.extend(true, XenForo,
			{
				visitor: { user_id: 622126 },
				serverTimeInfo:
				{
					now: 1528673901,
					today: 1528606800,
					todayDow: 0
				},
				_lightBoxUniversal: "0",
				_enableOverlays: "1",
				_animationSpeedMultiplier: "1",
				_overlayConfig:
				{
					top: "10%",
					speed: 200,
					closeSpeed: 100,
					mask:
					{
						color: "rgb(255, 255, 255)",
						opacity: "0.6",
						loadSpeed: 200,
						closeSpeed: 100
					}
				},
				_ignoredUsers: [],
				_loadedScripts: { "thread_view": true, "message": true, "bb_code": true, "message_user_info": true, "likes_summary": true, "quick_reply": true, "editor_ui": true, "attachment_editor": true, "share_page": true, "notices": true, "panel_scroller": true, "xengallery_tab_links": true, "js\/xenforo\/discussion.js?_v=4d29ecb3": true, "js\/redactor\/redactor.js?_v=4d29ecb3": true, "js\/xenforo\/bb_code_edit.js?_v=4d29ecb3": true, "js\/xenforo\/attachment_editor_new.js?_v=4d29ecb3": true, "js\/flow.js\/flow-rollup.min.js?_v=4d29ecb3": true },
				_cookieConfig: { path: "/", domain: "", prefix: "xf_" },
				_csrfToken: "622126,1528673901,c685a05905d6d1f66d441f8fc1a5065089895e21",
				_csrfRefreshUrl: "login/csrf-token-refresh",
				_jsVersion: "4d29ecb3",
				_noRtnProtect: false,
				_noSocialLogin: false
			});
		jQuery.extend(XenForo.phrases,
			{
				cancel: "Cancel",

				a_moment_ago: "A moment ago",
				one_minute_ago: "1 minute ago",
				x_minutes_ago: "%minutes% minutes ago",
				today_at_x: "Today at %time%",
				yesterday_at_x: "Yesterday at %time%",
				day_x_at_time_y: "%day% at %time%",

				day0: "Sunday",
				day1: "Monday",
				day2: "Tuesday",
				day3: "Wednesday",
				day4: "Thursday",
				day5: "Friday",
				day6: "Saturday",

				_months: "January,February,March,April,May,June,July,August,September,October,November,December",
				_daysShort: "Sun,Mon,Tue,Wed,Thu,Fri,Sat",

				following_error_occurred: "The following error occurred",
				server_did_not_respond_in_time_try_again: "The server did not respond in time. Please try again.",
				logging_in: "Logging in",
				click_image_show_full_size_version: "Click this image to show the full-size version.",
				show_hidden_content_by_x: "Show hidden content by {names}"
			});

		// Facebook Javascript SDK
		XenForo.Facebook.appId = "121096628388";
		XenForo.Facebook.forceInit = true;


	</script>




</body>

</html>
`;
