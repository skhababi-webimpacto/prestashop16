<?php
/**
* 2007-2018 PrestaShop
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
*  @author    PrestaShop SA <contact@prestashop.com>
*  @copyright 2007-2018 PrestaShop SA
*  @license   http://opensource.org/licenses/afl-3.0.php  Academic Free License (AFL 3.0)
*  International Registered Trademark & Property of PrestaShop SA
*/

if (!defined('_PS_VERSION_')) {
    exit;
}

class Wim_exportproduct extends Module
{
    protected $config_form = false;

    public function __construct()
    {
        $this->name = 'wim_exportproduct';
        $this->tab = 'export';
        $this->version = '1.0.0';
        $this->author = 'Said El Khababi';
        $this->need_instance = 0;

        /**
         * Set $this->bootstrap to true if your module is compliant with bootstrap (PrestaShop 1.6)
         */
        $this->bootstrap = true;

        parent::__construct();

        $this->displayName = $this->l('Wim export products CSV');
        $this->description = $this->l('Modulo de exportación de productos en CSV');

        $this->ps_versions_compliancy = array('min' => '1.6', 'max' => _PS_VERSION_);
    }

    /**
     * Don't forget to create update methods if needed:
     * http://doc.prestashop.com/display/PS16/Enabling+the+Auto-Update
     */
    public function install()
    {
        Configuration::updateValue('WIM_EXPORTPRODUCT_LIVE_MODE', false);

        return parent::install() &&
            $this->registerHook('header') &&
            $this->registerHook('backOfficeHeader');
    }

    public function uninstall()
    {
        Configuration::deleteByName('WIM_EXPORTPRODUCT_LIVE_MODE');

        return parent::uninstall();
    }

    /**
     * Load the configuration form
     */
    public function getContent()
    {
        /**
         * If values have been submitted in the form, process.
         */
        $output = null;

        if (((bool)Tools::isSubmit('submitWim_exportproductModule')) == true) {
            $this->postProcess();
        }

        $this->context->smarty->assign('module_dir', $this->_path);

        /**************/
        // $output = $this->context->smarty->fetch($this->local_path.'views/templates/admin/configure.tpl');
        $output .= $this->displayConfirmation($this->l('Settings updated'));
        /**************/

        return $output.$this->renderForm();
    }

    /**
     * Create the form that will be displayed in the configuration of your module.
     */
    protected function renderForm()
    {


        $helper = new HelperForm();

        $helper->show_toolbar = false;
        $helper->table = $this->table;
        $helper->module = $this;
        $helper->default_form_language = $this->context->language->id;
        $helper->allow_employee_form_lang = Configuration::get('PS_BO_ALLOW_EMPLOYEE_FORM_LANG', 0);

        $helper->identifier = $this->identifier;
        $helper->submit_action = 'submitWim_exportproductModule';
        $helper->currentIndex = $this->context->link->getAdminLink('AdminModules', false)
            .'&configure='.$this->name.'&tab_module='.$this->tab.'&module_name='.$this->name;
        $helper->token = Tools::getAdminTokenLite('AdminModules');

        $helper->tpl_vars = array(
            'fields_value' => $this->getConfigFormValues(), /* Add values for your inputs */ /* By Said: Manage here the value of select */
            'languages' => $this->context->controller->getLanguages(),
            'id_language' => $this->context->language->id,
        );


        return $helper->generateForm(array($this->getConfigForm()));
    }

    /**
     * Create the structure of your form.
     */
    protected function getConfigForm()
    {
        $manufacturers = $this->getSelectValues();

        return array(
            'form' => array(
                'legend' => array(
                    'title' => $this->l('Settings'),
                    'icon' => 'icon-cogs',
                ),
                'input' => array(
                    /*************** said **********************/
                    array(
                        'type' => 'select',
                        'lang' => true,
                        'label' => $this->l('Todos los fabricantes'),
                        'name' => 'MANUFACTURERID',    /* Appears in the value of the name attribute and used by getConfigFormValues() */
                        'desc' => $this->l('Seleccióna un fabricante'),
                        'options' => array(
                            'query' => $manufacturers,
                                /*
                                array('id_option' => 1,
                                    'name' => 'name1'),
                                array('id_option' => 2,
                                    'name' => 'name2'),
                                */

                            'id' => 'id_option',
                            'name' => 'name'
                        )
                    ),
                    /****************************************/
                 ),

                'submit' => array(
                    'title' => $this->l('Download'),
                ),
            ),/* End form 1*/
        );
    }

    /**
     * Set values for the inputs.
     */
    protected function getConfigFormValues()
    {
        return array(
            'WIM_EXPORTPRODUCT_LIVE_MODE' => Configuration::get('WIM_EXPORTPRODUCT_LIVE_MODE', true), /* Configuration::Get() recovers the value of the Configuration values from ps_configuration table */
            'WIM_EXPORTPRODUCT_ACCOUNT_EMAIL' => Configuration::get('WIM_EXPORTPRODUCT_ACCOUNT_EMAIL', 'contact@prestashop.com'),
            'WIM_EXPORTPRODUCT_ACCOUNT_PASSWORD' => Configuration::get('WIM_EXPORTPRODUCT_ACCOUNT_PASSWORD', null),

            'MANUFACTURERID' => Tools::getValue('id_option'),
        );
    }

    /**
     * Save form data.
     */
    protected function postProcess()
    {
        $form_values = $this->getConfigFormValues();
        $manufid = null;

        foreach (array_keys($form_values) as $key) {
            if($key!='MANUFACTURERID'){
                Configuration::updateValue($key, Tools::getValue($key));
            }else{
                 $manufid = (int)Tools::getValue($key);
            }
        }


        /* Download products in CSV */

        $products = $this->getSelectedManufacturerProducts($manufid);       // Tools::getValue >> Gets the value from a sent $_GET or $_POST

        $this->downloadProductsCsv($products, 'products.csv');

        //var_dump(Tools::getValue('id_option'));
       exit; /* IMPORTANT: It has to exit to stop the execution of the renderFrom() function. It does not return a response until all code in getContent is executed */

    }

    protected function downloadProductsCsv($array, $filename = "export.csv", $delimiter=";") {

        $cols = array('id_product','id_product_attribute','reference','EAN','stock','wholesale_price','price');

        // open raw memory as file so no temp files needed, you might run out of memory though
        $f = fopen('php://memory', 'w');

        fputcsv($f, $cols, $delimiter);


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


    /************************/
    protected function getSelectValues(){
        $manufacturers = array();
        $result = Db::getInstance()->executeS('SELECT * FROM ps_manufacturer');
        foreach($result as $row){
            $manufacturers[$row['id_manufacturer']] = array('id_option'=> $row['id_manufacturer'], /* Must set the index for the array. Otherwise it will replace the existing value at each row !!*/
                                         'name'    => $row['name'],
            );
        }
        return $manufacturers;
    }
    /************************/

    protected function getSelectedManufacturerProducts($idmanufacturer){

        return Db::getInstance()->executeS('SELECT id_product, reference, ean13, wholesale_price, price, id_product_attribute, quantity
                                              FROM (SELECT p.id_product, pa.id_product_attribute, p.reference, p.ean13,  sa.quantity, p.wholesale_price, p.price,  man.id_manufacturer
                                            FROM '._DB_PREFIX_.'product p, '._DB_PREFIX_.'product_attribute pa, '._DB_PREFIX_.'stock_available sa, '._DB_PREFIX_.'manufacturer man
                                            WHERE p.id_manufacturer = man.id_manufacturer AND p.id_product = pa.id_product AND sa.id_product = p.id_product AND man.id_manufacturer = '.$idmanufacturer.'
                                            GROUP BY pa.id_product_attribute
                                            ORDER BY p.id_product) ALIAS');

                                            /* SELECT p.id_product, p.reference, p.ean13, p.wholesale_price, p.price, pa.id_product_attribute, sa.quantity, man.id_manufacturer FROM ps_product p, ps_product_attribute pa, ps_stock_available sa, ps_manufacturer man WHERE p.id_manufacturer = man.id_manufacturer AND p.id_product = pa.id_product AND man.id_manufacturer = 1 GROUP BY pa.id_product_attribute */ /* WORKING*/
                                            /* to use for products without attributes. Does not have the id_product_attribute column */
                                            /* SELECT p.id_product, p.reference, p.ean13, p.wholesale_price, p.price, sa.quantity, man.id_manufacturer FROM ps_product p, ps_stock_available sa, ps_manufacturer man WHERE p.id_manufacturer = man.id_manufacturer AND man.id_manufacturer = 2 AND sa.id_product = p.id_product ORDER BY p.id_product */
    }


    /**
    * Add the CSS & JavaScript files you want to be loaded in the BO.
    */
    public function hookBackOfficeHeader()
    {
        if (Tools::getValue('module_name') == $this->name) {
            $this->context->controller->addJS($this->_path.'views/js/back.js');
            $this->context->controller->addCSS($this->_path.'views/css/back.css');
        }
    }

    /**
     * Add the CSS & JavaScript files you want to be added on the FO.
     */
    public function hookHeader()
    {
        $this->context->controller->addJS($this->_path.'/views/js/front.js');
        $this->context->controller->addCSS($this->_path.'/views/css/front.css');
    }
}
