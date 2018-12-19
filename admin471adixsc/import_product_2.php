<?php

define('PS_ADMIN_DIR', getcwd());
include(PS_ADMIN_DIR.'/../config/config.inc.php');
include(PS_ADMIN_DIR.'/functions.php');
include_once '../controllers/admin/AdminImportController.php';

if (!isset($_GET['entity']))
  die();

$import = New AdminImport();

loadProductsPost();
$import->productImport();

function loadProductsPost() {
  $_POST = array (
      'tab' => 'AdminImport',
      'skip' => '0',
      'csv' => 'pro.csv',
      'convert' => '',
      'entity' => '1',
      'separator' => ';',
      'multiple_value_separator' => ',',
      'import' => 'Importar datos CSV',
      'type_value' =>
          array (
              0 => 'id',
              1 => 'active',
              2 => 'name',
              3 => 'category',
              4 => 'price_tex',
              5 => 'tax_rate',
              6 => 'wholesale_price',
              7 => 'on_sale',
              8 => 'reduction_price',
              9 => 'reduction_percent',
              10 => 'reduction_from',
              11 => 'reduction_to',
              12 => 'reference',
              13 => 'supplier_reference',
              14 => 'supplier',
              15 => 'manufacturer',
              16 => 'ean13',
              17 => 'ecotax',
              18 => 'weight',
              19 => 'quantity',
              20 => 'description_short',
              21 => 'description',
              22 => 'tags',
              23 => 'meta_title',
              24 => 'meta_keywords',
              25 => 'meta_description',
              26 => 'available_now',
              27 => 'available_later',
              28 => 'image',
              29 => 'no',
          ),
  );
}
?>