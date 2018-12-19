<?php
/**
 * Created by PhpStorm.
 * User: YV-01-040
 * Date: 04/12/2018
 * Time: 15:24
 */

/* These two lines are very important for making available all Prestashop functions and classes */
/* dirname(__FILE__) is the path to the folder containing this file */
include(dirname(__FILE__).'/config/config.inc.php');
include(dirname(__FILE__).'/init.php');

/*

$xml_file = 'products.xml';
$xml = simplexml_load_file($xml_file);

foreach ($xml->Product as $productinfo)
{
    if ($productinfo->Valid_internet_product == 1)
    {
        // Update an existing product or Create a new one
         $id_product = Product::getIdByReference($productinfo->Reference);
         // $id_product = (int)Db::getInstance()->getValue('SELECT id_product FROM '._DB_PREFIX_.'product WHERE reference = \''.pSQL($productinfo->Reference).'\'');

        $product = new Product((int)$id_product, true);
        $product->reference = $productinfo->Reference;
        $product->price = (float)$productinfo->Price;
        $product->active = (int)$productinfo->Active_product;
        $product->weight = (float)$productinfo->Weight;
        $product->minimal_quantity = (int)$productinfo->MinOrderQty;
        $product->id_category_default = 2;
        $product->name[1] = utf8_encode($productinfo->Product_name);
        $product->description[1] = utf8_encode($productinfo->Description);
        $product->description_short[1] = utf8_encode($productinfo->Short_Description);
        $product->link_rewrite[1] = Tools::link_rewrite($productinfo->Product_name);
        if (!isset($product->date_add) || empty($product->date_add))
            $product->date_add = date('Y-m-d H:i:s');
        $product->date_upd = date('Y-m-d H:i:s');
        $id_product ? $product->updateCategories(array(2)) : $product->addToCategories(array(2));
        $product->save();

        echo 'Product <b>'.$product->name[1].'</b> '.($id_product ? 'updated' : 'created').'<br />';

/*        $product_duplicate = new Product(5);
        $product_duplicate->id = 0;
        $product_duplicate->save();


    }
}
*/

// echo Tools::getValue('id_option');

$obj1 = new StdClass();
$obj1->number = 1;

$arr = array($obj1,2,3,4,5);

$exportedCsv = new CSVCore($arr, 'products');


$exportedCsv->export();


/*
$array = array (
    array('header 1', 'header 2', 'header 3', 'header 4'),
    array('5656', '454545', '5455', '5454'),
    array('541212', '454545', '5455', '5454'),
    array('541212', '454545', '5455', '5454'),
);

function array_to_csv_download($array, $filename = "export.csv", $delimiter=";") {
    // open raw memory as file so no temp files needed, you might run out of memory though
    $f = fopen('php://memory', 'w');
    // loop over the input array
    foreach ($array as $line) {
        // generate csv lines from the inner arrays
        fputcsv($f, $line, $delimiter);
    }
    // reset the file pointer to the start of the file
    fseek($f, 0);
    // tell the browser it's going to be a csv file
    header('Content-Type: application/csv; charset=UTF-8');
    // tell the browser we want to save it instead of displaying it
    header('Content-Disposition: attachment;filename="'.$filename.'";');
    // make php send the generated csv lines to the browser
    fpassthru($f);
}


array_to_csv_download(array(
    array(1,2,3,4), // this array is going to be the first row
    array(1,2,3,4)), // this array is going to be the second row
    "numbers.csv"
);
*/


/*
$manufacturers = array();

$result = Db::getInstance()->executeS('SELECT * FROM ps_manufacturer');
foreach($result as $row){
    $manufacturers = array('id_option'=> $row['id_manufacturer'],
        'name' => $row['name'],
    );
    echo $manufacturers['id_option'];
    echo '<BR>';
    ECHO $manufacturers['name'];
}
*/

/* $daysago = -1;

// echo $daysago = (int)(Configuration::get('DAYSAGO'));
//ECHO '<BR>';
//echo 'This->>: '.$datesearch = date("Y-m-d", strtotime("-".$daysago."day"));

//ECHO '<BR>';

//echo 'date: '.date("Y-m-d");

/*$nbsales =  Db::getInstance()->getValue('SELECT COUNT(*) FROM ps_product, ps_orders, ps_order_detail WHERE
                                    ps_orders.id_order = ps_order_detail.id_order AND
                                    ps_order_detail.product_id = ps_product.id_product
                                    AND ps_product.id_product = 2 AND (ps_orders.date_upd BETWEEN DATE(\''.$datesearch.'\') AND DATE(\'2018-12-13\'))');*/

/* ECHO '<BR>';
$prod = new Product(2);
// Db::getInstance()->execute('UPDATE ps_product SET id_supplier = 1 WHERE id_product = '.$product['id_product']);

echo $prod->number_sales = $prod->getNumberSales($daysago);
ECHO '<BR>';
echo $prod->nb_sales_updated;
$prod->numberSalesUpdated();
ECHO '<BR>';
var_dump($prod->nb_sales_updated);

// ECHO '<BR>';
// print_r($daysago);


// ECHO $date = date("Y-m-d", strtotime("-5 day"));
// ECHO '<BR>';
// ECHO $dte = date("Y-m-d");

/*
$result = Db::getInstance()->execute('SELECT * FROM INFORMATION_SCHEMA.columns WHERE TABLE_NAME =\''._DB_PREFIX_.'product\' AND COLUMN_NAME = \'number_sales_updated\'');

$result = Db::getInstance()->execute('SELECT * FROM '._DB_PREFIX_.'product WHERE \'number_sales_updated\'');

$result = Db::getInstance()->execute('SELECT * FROM '._DB_PREFIX_.'product WHERE id_product = 1');


$result = Db::getInstance()->execute('SHOW INDEX FROM ps_product WHERE column_name = \'number_sales\'');

 if(Db::getInstance()->execute('SELECT * FROM ps_product WHERE number_sales_updated')){
    echo 'yes';
}else{
     echo 'not set';
 }*/

