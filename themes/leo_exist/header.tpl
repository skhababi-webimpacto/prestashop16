{*
* 2007-2014 PrestaShop
*
* NOTICE OF LICENSE
*
* This source file is subject to the Academic Free License (AFL 3.0)
* that is bundled with this package in the file LICENSE.txt.
* It is also available through the world-wide-web at this URL:
* http://opensource.org/licenses/afl-3.0.php
* If you did not receive a copy of the license and are unable to
* obtain it through the world-wide-web, please send an email
* to license@prestashop.com so we can send you a copy immediately.
*
* DISCLAIMER
*
* Do not edit or add to this file if you wish to upgrade PrestaShop to newer
* versions in the future. If you wish to customize PrestaShop for your
* needs please refer to http://www.prestashop.com for more information.
*
*  @author PrestaShop SA <contact@prestashop.com>
*  @copyright  2007-2014 PrestaShop SA
*  @license    http://opensource.org/licenses/afl-3.0.php  Academic Free License (AFL 3.0)
*  International Registered Trademark & Property of PrestaShop SA
*}
<!DOCTYPE HTML>
<!--[if lt IE 7]> <html class="no-js lt-ie9 lt-ie8 lt-ie7 " lang="{$lang_iso}"><![endif]-->
<!--[if IE 7]><html class="no-js lt-ie9 lt-ie8 ie7" lang="{$lang_iso}"><![endif]-->
<!--[if IE 8]><html class="no-js lt-ie9 ie8" lang="{$lang_iso}"><![endif]-->
<!--[if gt IE 8]> <html class="no-js ie9" lang="{$lang_iso}"><![endif]-->
<html lang="{$lang_iso}" {if isset($IS_RTL) && $IS_RTL} dir="rtl" class="rtl{if isset($LEO_DEFAULT_SKIN)} {$LEO_DEFAULT_SKIN}{/if}" {else} class="{if isset($LEO_DEFAULT_SKIN)}{$LEO_DEFAULT_SKIN}{/if}" {/if}>
	{include file="$tpl_dir./layout/setting.tpl"}
	<head>
		<meta charset="utf-8" />
		<title>{$meta_title|escape:'html':'UTF-8'}</title>
{if isset($meta_description) AND $meta_description}
		<meta name="description" content="{$meta_description|escape:'html':'UTF-8'}" />
{/if}
{if isset($meta_keywords) AND $meta_keywords}
		<meta name="keywords" content="{$meta_keywords|escape:'html':'UTF-8'}" />
{/if}
		<meta name="generator" content="PrestaShop" />
		<meta name="robots" content="{if isset($nobots)}no{/if}index,{if isset($nofollow) && $nofollow}no{/if}follow" />
{if $ENABLE_RESPONSIVE}<meta name="viewport" content="width=device-width, minimum-scale=0.25, maximum-scale=1.6, initial-scale=1.0" />{/if}
		<meta name="apple-mobile-web-app-capable" content="yes" /> 
		<link rel="icon" type="image/vnd.microsoft.icon" href="{$favicon_url}?{$img_update_time}" />
		<link rel="shortcut icon" type="image/x-icon" href="{$favicon_url}?{$img_update_time}" />
            
{if isset($css_files)}
		{foreach from=$css_files key=css_uri item=media}
		<link rel="stylesheet" href="{$css_uri|escape:'html':'UTF-8'}" type="text/css" media="{$media|escape:'html':'UTF-8'}" />
			{/foreach}
{/if}

{if isset($js_defer) && !$js_defer && isset($js_files) && isset($js_def)}
			{$js_def}
			{foreach from=$js_files item=js_uri}
			<script type="text/javascript" src="{$js_uri|escape:'html':'UTF-8'}"></script>
			{/foreach}
{/if}
		{if $ENABLE_RESPONSIVE}
		<link rel="stylesheet" type="text/css" href="{$content_dir}themes/{$LEO_THEMENAME}/css/responsive.css"/>
		{else}
		<link rel="stylesheet" type="text/css" href="{$content_dir}themes/{$LEO_THEMENAME}/css/non-responsive.css"/>
		{/if}
		<link rel="stylesheet" type="text/css" href="{$content_dir}themes/{$LEO_THEMENAME}/css/font-awesome.min.css"/>
		{$HOOK_HEADER}
                {if isset($LEO_CSS)}{foreach from=$LEO_CSS key=css_uri item=media}
                <link rel="stylesheet" href="{$css_uri}" type="text/css" media="{$media}" />
                {/foreach}{/if}
		{if isset($CUSTOM_FONT)}
                {$CUSTOM_FONT}
		{/if}
		{if isset($LAYOUT_WIDTH)}
                {$LAYOUT_WIDTH}
		{/if}
		
		<link href='http://fonts.googleapis.com/css?family=Lato:400,100,100italic,300,300italic,400italic,700,700italic,900,900italic' rel='stylesheet' type='text/css'>
		
		<link href='http{if Tools::usingSecureMode()}s{/if}://fonts.googleapis.com/css?family=Kaushan+Script' rel='stylesheet' type='text/css' />
		
		<!--[if IE 8]>
		<script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
		<script src="https://oss.maxcdn.com/libs/respond.js/1.3.0/respond.min.js"></script>
		<![endif]-->
		
	</head>
	<body{if isset($page_name)} id="{$page_name|escape:'html':'UTF-8'}"{/if} class="{if isset($page_name)}{$page_name|escape:'html':'UTF-8'}{/if}{if isset($body_classes) && $body_classes|@count} {implode value=$body_classes separator=' '}{/if}{if $hide_left_column} hide-left-column{/if}{if $hide_right_column} hide-right-column{/if}{if isset($content_only) &&  $content_only} content_only{/if} lang_{$lang_iso} {if isset($LEO_LAYOUT_MODE)}{$LEO_LAYOUT_MODE}{/if}{if isset($USE_FHEADER) && $USE_FHEADER} keep-header{/if}">
		{if !isset($content_only) || !$content_only}
		{if isset($restricted_country_mode) && $restricted_country_mode}
			<section id="restricted-country">
				<p>{l s='You cannot place a new order from your country.'} <span class="bold">{$geolocation_country}</span></p>
			</section>
		{/if}
		<!--said-->
		{if isset($product)}
			{if !$priceDisplay || $priceDisplay == 2}
			{assign var='productPrice' value=$product->getPrice(true, $smarty.const.NULL, $priceDisplayPrecision)}
			{/if}
		{/if}
		<section id="page" data-column="{$colValue}" data-type="{$LISTING_GRIG_MODE}">
			<!-- Header -->
			<header id="header"">
				<section class="header-container">
					<div id="topbar">
						<div class="banner">
							<div class="container">
								<div class="row">
									{hook h="displayBanner"}
								</div>
							</div>
						</div>
						<div class="nav">
							<div class="container">
								<div class="inner">
										<nav>{hook h="displayNav"}</nav>
								</div>
							</div>
						</div>
					</div>
					<div id="header-main">
						<div class="container">
							<div class="inner">
								<div id="header_logo" class="col-lg-2 col-md-2 col-sm-12 col-xs-12 pull-left">
									<a href="{$base_dir}" title="{$shop_name|escape:'html':'UTF-8'}">
										<img class="logo img-responsive" src="{$logo_url}" alt="{$shop_name|escape:'html':'UTF-8'}"{if $logo_image_width} width="{$logo_image_width}"{/if}{if $logo_image_height} height="{$logo_image_height}"{/if}/>
									</a>
								</div>
								<div id="header_right">
									{if isset($HOOK_TOP)}{$HOOK_TOP}{/if}
									
									{if isset($HOOK_TOPNAVIGATION)&&!empty($HOOK_TOPNAVIGATION)}
										<div id="leo-mainnav">
												{$HOOK_TOPNAVIGATION}
										</div>
									{/if}
								</div>					
							</div>
						</div>
					</div>
					<!-- *** -->
					<!-- Added by Said -->
					{if isset($product)}
						<div id="header-curtain" class="curtainoff col-xs-12">

							<div class="container-curtain col-xs-12">

								<div id="imgcurtain" class="img responsive col-xs-2">
									<img class ="col-xs-12 col-md-12" itemprop="image" src="{$link->getImageLink($product->link_rewrite, $cover.id_image, 'cart_default')|escape:'html':'UTF-8'}">
								</div>

								<div class="inner-curtain col-xs-10 col-md-10">

									<div class = "col-xs-8 col-md-8" id="short_description_curtain" class="rte align_justify" itemprop="description">
										<h1 class = "col-xs-12 col-md-12" style="padding: 0;">{$product->name|escape:'html':'UTF-8'}</h1>
										{$product->description_short}
									</div>
									<div id="pricebtn" class = "col-xs-4 col-md-4">
										<div class = "col-xs-6 col-md-6" id="our_price_display_curtain" itemprop="price" style="top: 17px; font-weight: bold;">{convertPrice price=$productPrice}</div>
										<div class = "col-xs-6 col-md-6" id="add_to_cart_curtain" style="top: 17px;">
											<button id="addtocartbtn2" type="submit" name="Submit" class="button exclusive">
												<i class="fa fa-shopping-cart"></i>
												<span id="">{l s='Add to cart'}</span>
											</button>

										</div>
									</div>
								</div>
							</div>
						</div>
					{/if}
					<!-- End Added by Said -->



				</section>
			</header>
			
			{if isset($HOOK_SLIDESHOW)&& !empty($HOOK_SLIDESHOW) && in_array($page_name,array('index'))}
				<section id="slideshow" class="clearfix">
					<div class="container container-nopadding">
							{$HOOK_SLIDESHOW}
					</div>
				</section>
            {/if}
				            
			{if $page_name !='index' && $page_name !='pagenotfound'}
				<section id="breadcrumb" class="clearfix">
					<div class="container container-nopadding">
						<div class="inner">
						  {include file="$tpl_dir./breadcrumb.tpl"}
						</div>
					</div>
				</section>
			{/if}
			
			<!-- Content -->
			<section id="columns" class="columns-container">
				<div class="container">
					{if in_array($page_name,array('index'))}
						<div id="top_column" class="center_column clearfix">
							{hook h="displayTopColumn"}
						</div>
					{/if}
					<div class="row">
                                                
                    {if !isset($LEO_LAYOUT_DIRECTION)} {assign var="LEO_LAYOUT_DIRECTION" value="default" scope='global'} {/if}
						{include file="$tpl_dir./layout/{$LEO_LAYOUT_DIRECTION}/header.tpl"}  
	{/if}
