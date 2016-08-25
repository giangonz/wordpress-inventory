#Installing

1. Unzip archive at `wp-content/plugins` 
2. Activate plugin in Administration > Plugins

#Usage

1. Login to admin interface
2. Upload a new inventory file in Inventory
3. Get the id of the newly uploaded file
4. Create a page with the following shortcode, substituting **ID** with your file id
	```
	 [ccsi_inventory id=ID]
	```
5. View the page