<?php
class Product extends ProductCore
{
    /*
    * module: wim_sort_products
    * date: 2018-12-16 11:58:40
    * version: 1.3.0
    */
    public $nb_sales_updated;
    /*
    * module: wim_sort_products
    * date: 2018-12-13 11:32:45
    * version: 1.3.0
    */

    public $number_sales;
    /*
    * module: wim_sort_products
    * date: 2018-12-16 12:09:10
    * version: 1.3.0
    */

    public function __construct($id_product = null, $full = false, $id_lang = null, $id_shop = null, Context $context = null)
    {
        // $this->number_sales = $nbsales;

        $this->nb_sales_updated = date('Y-m-d'); /* Affecting the current date*/

        parent::__construct($id_product, $full, $id_lang, $id_shop, $context);



    }
    /*
    * module: wim_sort_products
    * date: 2018-12-13 11:32:45
    * version: 1.3.0
    */

    /*
    * module: wim_sort_products
    * date: 2018-12-16 12:09:10
    * version: 1.3.0
    */
    public function getNumberSales($xdays){

        $datesearch = date("Y-m-d", strtotime("-".$xdays."day"));
        $dte = date("Y-m-d");
        $nbsales =  Db::getInstance()->getValue('SELECT COUNT(*) FROM ps_product, ps_orders, ps_order_detail WHERE
                                    ps_orders.id_order = ps_order_detail.id_order AND
                                    ps_order_detail.product_id = ps_product.id_product
                                    AND ps_product.id_product = \''.$this->id.'\' AND (ps_orders.date_upd BETWEEN DATE(\''.$datesearch.'\') AND DATE(\''.$dte.'\'))');
        return $nbsales;
    }

    /*
    * module: wim_sort_products
    * date: 2018-12-16 12:09:10
    * version: 1.3.0
    */
    public function numberSalesUpdated(){
        Db::getInstance()->execute('UPDATE '._DB_PREFIX_.'product SET number_sales = '.$this->number_sales.', number_sales_updated = '.$this->nb_sales_updated.' WHERE id_product = '.$this->id);
    }
    /*
    * module: wim_sort_products
    * date: 2018-12-13 11:32:45
    * version: 1.3.0
    */
    /*
    * module: wim_sort_products
    * date: 2018-12-16 12:09:10
    * version: 1.3.0
    */
    public static function getIdByReference($ref){
        $prod_id = Db::getInstance()->getValue('SELECT id_product FROM '._DB_PREFIX_.'product WHERE reference =\''.$ref.'\'');
        return $prod_id;
    }
}
