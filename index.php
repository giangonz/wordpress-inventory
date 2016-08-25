<?php
    /**
     * @package CCSI Inventory
     * @version 1.0
     */
    /*
    Plugin Name: CCSI Inventory
    Plugin URI: http://cssi.com
    Description: Plugin to mange ccsi inventory
    Author: Jose R. Villalon
    Version: 1.0
    */

    ini_set('display_errors' , 1);

    // Install Plugin
    function ccsi_inventory_activate() {
        global $wpdb;

        // Create table Sql
        $PREFIX = $wpdb->prefix;
        $CHARSET_COLLATE = $wpdb->get_charset_collate();

        $sql = "
            CREATE TABLE `${PREFIX}inventory` (
              `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
              `media_id` bigint(20) unsigned NOT NULL,
              UNIQUE KEY `id` (`id`),
              KEY `media_id` (`media_id`),
              CONSTRAINT `wp_inventory_ibfk_1`
              FOREIGN KEY (`media_id`) REFERENCES `wp_posts` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
            ) ENGINE=InnoDB $CHARSET_COLLATE;

            CREATE TABLE `${PREFIX}inventory_fields` (
              `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
              `inventory_id` int(11) unsigned NOT NULL,
              `field` varchar(255) NOT NULL,
              `position` int(11) unsigned NOT NULL,
              PRIMARY KEY (`id`),
              KEY `inventory_id` (`inventory_id`),
              CONSTRAINT `wp_inventory_fields_ibfk_1`
              FOREIGN KEY (`inventory_id`) REFERENCES `wp_inventory` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
            ) ENGINE=InnoDB $CHARSET_COLLATE;

            CREATE TABLE `${PREFIX}inventory_rows` (
              `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
              `inventory_id` int(11) unsigned NOT NULL,
              PRIMARY KEY (`id`),
              KEY `inventory_id` (`inventory_id`),
              CONSTRAINT `wp_inventory_rows_ibfk_1` FOREIGN KEY (`inventory_id`) REFERENCES `wp_inventory` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
            ) ENGINE=InnoDB $CHARSET_COLLATE;

            CREATE TABLE `${PREFIX}inventory_values` (
              `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
              `field_id` int(11) unsigned NOT NULL,
              `row_id` int(10) unsigned NOT NULL,
              `value` varchar(255) NOT NULL DEFAULT '',
              PRIMARY KEY (`id`),
              KEY `row_id` (`row_id`),
              KEY `field_id` (`field_id`),
              CONSTRAINT `wp_inventory_values_ibfk_2` FOREIGN KEY (`field_id`) REFERENCES `wp_inventory_fields` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
              CONSTRAINT `wp_inventory_values_ibfk_1` FOREIGN KEY (`row_id`) REFERENCES `wp_inventory_rows` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
             ) ENGINE=InnoDB $CHARSET_COLLATE;
        ";

        // Create table
        require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
        dbDelta( $sql );
    }

    register_activation_hook( __FILE__, 'ccsi_inventory_activate' );

    // Require Files
    require('public/index.php');
    require('admin/index.php');
