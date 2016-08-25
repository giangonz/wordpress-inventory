<?php

    require(__DIR__ . '/../lib/phpexcel/Classes/PHPExcel.php');

    function toCamelCase($word) {
      return lcfirst(str_replace(' ', "", ucwords(strtr($word, '_-', ' '))));
    }

    function ccsi_inventory_admin_menu( ) {
        add_menu_page( 'Inventory', 'Inventory', 'administrator', 'ccsi-inventory' , 'ccsi_inventory_admin');
    }

    function ccsi_inventory_admin() {
        global $wpdb;

        set_time_limit(0);
        ini_set('memory_limit', -1);

        $PREFIX = $wpdb->prefix;
        $UPLOAD_FILE_NAME = 'upload_inventory';
        $success = '';
        $error = '';

        // Check if there was a new file
        if(isset($_FILES[$UPLOAD_FILE_NAME])){

            //Upload file
            $uploaded = media_handle_upload($UPLOAD_FILE_NAME, 0);

            // Check upload
            if(is_wp_error($uploaded)){
                // Show Error
                $error = "Error uploading file: " . $uploaded->get_error_message();
            } else {

                // Show Success
                $success = "Successfully uploaded file";

                // Get the filename for the upload
                $post = $wpdb->get_row("
                   SELECT * FROM $wpdb->posts i WHERE i.id = $uploaded
                ");
				$url = parse_url($post->guid);
                $filename = ABSPATH . $url['path'];

                // Parse the file
                $type = PHPExcel_IOFactory::identify($filename);
                $reader = PHPExcel_IOFactory::createReader($type);
                $reader->setReadDataOnly(true);
                $excel = $reader->load($filename);
                $sheet = $excel->getActivesheet();
                $rows = $sheet->getHighestRow() - 0;
                $cols = PHPExcel_Cell::columnIndexFromString( $sheet->getHighestColumn() );


                // Insert the inventory
                $data = array("media_id" => $uploaded);
                $wpdb->insert( "${PREFIX}inventory", $data );
                $inventory_id = $wpdb->insert_id;

                // Insert the fields
                $field_ids = array();
                for($i = 0 ; $i < $cols ; $i++ ){
                    $field = $sheet->getCellByColumnAndRow( $i , 1 )->getValue();
                    $data = array("inventory_id" => $inventory_id, "field" => $field, "position" => $i);
                    $wpdb->insert( "${PREFIX}inventory_fields", $data );
                    $field_ids[] = $wpdb->insert_id;
                }

                // Insert the rows
                for($i = 2 ; $i < $rows ; $i++ ){

                    // Create row
                    $data = array("inventory_id" => $inventory_id);
                    $wpdb->insert( "${PREFIX}inventory_rows", $data );
                    $row_id = $wpdb->insert_id;

                    // Insert Values
                    for($j = 0 ; $j < $cols ; $j++ ){
                        $value = $sheet->getCellByColumnAndRow( $j, $i )->getValue();
                        $data = array("row_id" => $row_id, "field_id" => $field_ids[$j], "value" => $value);
                        $wpdb->insert( "${PREFIX}inventory_values", $data );
                    }
                }
            }

        }

        // Delete post
        $delete_id = empty($_POST['_delete']) ? null : $_POST['_delete'];
        if(!empty($delete_id) && is_numeric($delete_id)) {

            // Delete inventory
			$wpdb->delete("${PREFIX}inventory", array("id" => $delete_id ));

            // Show success
            $success = "Successfully deleted uploaded file";
        }

        // Get the list of inventory lists
        $list = $wpdb->get_results("
           SELECT i.id , p.id as post_id, p.post_title
           FROM ${PREFIX}inventory i
           LEFT JOIN $wpdb->posts p ON p.id = i.media_id
        ");

        // Render Template
        $template = dirname(__FILE__) . '/index.html.php';
        ob_start();
        require($template);
        $result = ob_get_clean();
        echo $result;
    }

    add_action('admin_menu', 'ccsi_inventory_admin_menu');
