<div id="<?= $divId; ?>"></div>
<script>
  document.addEventListener("DOMContentLoaded", function(){
    var url = "<?= $dataUrl ?>";
	ccsiInventory.mount("#<?= $divId; ?>" , {
		height: <?= $height; ?>,
		rowHeight: <?= $rowHeight; ?>,
        dataFn: function(search, limit, offset) {
            return jQuery.post(url, {
                action: 'ccsi_inventory',
                id: '<?= $id; ?>',
                search: search,
                limit: limit,
                offset: offset,
            });
        },
		postFn: function(data) {
            data.action = 'ccsi_inventory_mail';
            return jQuery.post(url, data);
		},
	});
  });
</script>
