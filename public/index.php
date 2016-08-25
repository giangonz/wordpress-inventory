<?php

function ccsi_inventory_wphead(){
    wp_enqueue_style('ccsi_inventory.css', plugins_url('../js/dist/ccsi_inventory.css', __FILE__));
    wp_enqueue_script('ccsi_inventory.js', plugins_url('../js/dist/ccsi_inventory.js', __FILE__));
}

function ccsi_inventory_shortcode( $atts, $content , $tag) {

    global $wpdb;

    // Get constants
    $TABLE_NAME = $wpdb->prefix . "inventory";

    // Get the id
    $id = empty($atts['id']) ? null : $atts['id'];
    if(!$id) return '';

    // Get Data
    $divId = uniqid("ccsi_inventory");
    $height = !empty($atts['height']) ? $atts['height'] - 0 : 500;
    $rowHeight = !empty($atts['$rowHeight']) ? $atts['$rowHeight'] - 0 : 50;
    $dataUrl = admin_url( 'admin-ajax.php' );

    // Render Template
    $template = dirname(__FILE__) . '/index.html.php';
    ob_start();
    require($template);
    $result = ob_get_clean();
    return $result;
}

function wp_ajax_ccsi_inventory() {
    global $wpdb;

    // Get constants
    $PREFIX = $wpdb->prefix;

    $id = empty($_POST['id']) ? null : intval($_POST['id']);
    $limit = empty($_POST['limit']) ? 100 : intval($_POST['limit']);
    $offset = empty($_POST['offset']) ? 0 : intval($_POST['offset']);
    $search = empty($_POST['search']) ? "" : $_POST['search'];

    if(!$id) {
        echo json_encode(array());
        wp_die();
    }

    // Get the item
    $item = $wpdb->get_row("
        SELECT * FROM ${PREFIX}inventory i WHERE i.id = $id
    ", ARRAY_A);
    if(!$item) { echo json_encode(array()); wp_die(); }

    // Create response
    $response = array();

    // Get the headers
    $dataColumns = $wpdb->get_results("
        SELECT * FROM ${PREFIX}inventory_fields f WHERE f.inventory_id = $id
    ", ARRAY_A);

    // Add the columns
    $response["columns"] = array();
    foreach( $dataColumns as $i => $column ) {
        $response["columns"][] = array(
          "path" => $column['id'],
          "title" => $column['field'],
          "width" => 150,
          "flex" => $i === count($dataColumns) - 1,
          "resizable" => true,
        );
    }

    // Create search
    $words = array_filter(explode(" ", $search) , function($word) {
      return trim($word);
    });
    $wordCount = count($words);
    $searchParts = array();
    $havingParts = array();
    foreach( $words as $word ) {
     $word = $wpdb->_real_escape($word);
     $searchParts[] = "(v.value LIKE '%$word%')";
     $havingParts[] = "(GROUP_CONCAT(' ', v.value) LIKE '%$word%')";
    }
    if(empty($searchParts)) {
      $searchWhere = "1";
      $searchHaving = "";
    } else {
      $searchWhere  = implode($searchParts, " OR ");
      $searchHaving = "HAVING ".implode($havingParts, " AND ");
    }

    // Get the row ids
    $rows = $wpdb->get_results("
        SELECT SQL_CALC_FOUND_ROWS  r.id
        FROM ${PREFIX}inventory_rows r
        INNER JOIN ${PREFIX}inventory_values v on r.id = v.row_id
        WHERE r.inventory_id = $id
        AND $searchWhere
        GROUP BY r.id
        $searchHaving
        LIMIT $offset, $limit
    ", ARRAY_A);

    $rowIds = array();
    foreach( $rows as $row ) {
        $rowIds[] = $row['id'];
    }

    // Get the total of results
    $total = $wpdb->get_row("SELECT FOUND_ROWS() as total", ARRAY_A);
    $response["total"] = $total['total'];

    // Get the values
    $rowIdsStr = implode($rowIds, ",");
    $values = $wpdb->get_results("
        SELECT r.id as row_id, v.field_id, v.value
        FROM ${PREFIX}inventory_rows r
        INNER JOIN ${PREFIX}inventory_values v on r.id = v.row_id
        WHERE r.id IN($rowIdsStr)
        ORDER BY r.id
    ", ARRAY_A);

    $data = array();
    foreach( $values as $value ) {
        $row_id = $value['row_id'];
        $field_id = $value['field_id'];
        $value = $value['value'];
        if (empty($data[$row_id])) {
            $data[$row_id] = array(
                "id" =>  $row_id,
            );
        }
        $data[$row_id][$field_id] = $value;
    }
    $response['data'] = array_values($data);

    // Send response
    header('Content-Type: application/json');
    echo json_encode($response, JSON_PRETTY_PRINT);
    wp_die();

}

function wp_ajax_ccsi_inventory_mail() {

    $email = empty($_POST['email']) ? null : $_POST['email'];
    $message = empty($_POST['message']) ? null : $_POST['message'];
    $interested = empty($_POST['selection']) ? array() : $_POST['selection'];
    $to = get_option('admin_email');
    $subject = "Inventory Contact";
    $interested_in = "";
    foreach($interested as $interest) {
        $interested_in = "\t - $interest";
    }
$message =
"
Email: $email
--------------------
Message:
$message
--------------------
Interested In:
$interested_in
";
    wp_mail( $to, $subject, $message );
}

add_action('wp_head','ccsi_inventory_wphead');
add_shortcode('ccsi_inventory', 'ccsi_inventory_shortcode' );
add_action('wp_ajax_ccsi_inventory', 'wp_ajax_ccsi_inventory' );
add_action('wp_ajax_nopriv_ccsi_inventory', 'wp_ajax_ccsi_inventory' );
add_action('wp_ajax_ccsi_inventory_mail', 'wp_ajax_ccsi_inventory_mail' );
add_action('wp_ajax_nopriv_ccsi_inventory_mail', 'wp_ajax_ccsi_inventory_mail' );
