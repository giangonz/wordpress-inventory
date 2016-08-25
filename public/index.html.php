<?php $uniqid = uniqid("ccsi_inventory"); ?>
<div id="<?= $uniqid; ?>"></div>
<script>
  document.addEventListener("DOMContentLoaded", function(){
    var url = "<?= admin_url( 'admin-ajax.php' ); ?>";
    ccsiInventory.mount("#<?= $uniqid; ?>" ,
    <?= $height; ?>,
    function(search, limit, offset) {
        return jQuery.post(url, {
            action: 'ccsi_inventory',
            id: '<?= $id; ?>',
            search: search,
            limit: limit,
            offset: offset,
        });
    },
    function(data) {
      data.action = 'ccsi_inventory_mail';
      return jQuery.post(url, data);
    });
  });
</script>
