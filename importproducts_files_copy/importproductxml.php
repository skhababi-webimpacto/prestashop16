<?php
/**
 * Created by PhpStorm.
 * User: YV-01-040
 * Date: 04/12/2018
 * Time: 15:24
 */

/* These two lines are very important for making available all Prestashop functions and classes */
include(dirname(__FILE__).'/config/config.inc.php');
include(dirname(__FILE__).'/init.php');


$xml_file = 'products.xml';
$xml = simplexml_load_file($xml_file);
foreach ($xml->Product as $productinfo)
{
    if ($productinfo->Valid_internet_product == 1)
    {
        /* Update an existing product or Create a new one */
        $id_product = (int)Db::getInstance()->getValue('SELECT id_product FROM '._DB_PREFIX_.'product WHERE reference = \''.pSQL($productinfo->Reference).'\'');
        $product = $id_product ? new Product((int)$id_product, true) : new Product();
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
    }
}