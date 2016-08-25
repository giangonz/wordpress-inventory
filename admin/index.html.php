<h1> Inventory </h1>

<?php if( $error ) : ?>
	<div id="message" class="notice notice-error is-dismissible">
		<p><?= $error; ?></p>
		<button type="button" class="notice-dismiss"><span class="screen-reader-text">Dismiss this notice.</span></button>
	</div>
<?php endif; ?>

<?php if( $success ) : ?>
	<div id="message" class="notice notice-success is-dismissible">
		<p><?= $success; ?></p>
		<button type="button" class="notice-dismiss"><span class="screen-reader-text">Dismiss this notice.</span></button>
	</div>
<?php endif; ?>


<div class="card pressthis">
	<h2>Add a new Inventory List</h2>

    <form method="post" enctype="multipart/form-data">
        <input type='file' id='upload_inventory' name='upload_inventory' />
        <?php submit_button('Upload') ?>
    </form>

    <h2>Current Inventory Lists</h2>
    <table class='wp-list-table widefat fixed striped pages'>
        <thead>
            <th> ID </th>
            <th> File </th>
            <th> Actions </th>
        </thead>
        <tbody>
			<?php if(count($list)) : ?>
	            <?php foreach($list as $item) : ?>
					<tr>
		                <td> <?= $item->id; ?> </td>
		                <td> <?= $item->post_title; ?> </td>
		                <td>
							<form method="post">
								<input type='hidden' name='_delete' value='<?= $item->id; ?>' />
								<input type='submit' value='Delete'>
							</form>
		                </td>
					</tr>
	            <?php endforeach; ?>
			<?php else: ?>
				<tr>
					<td colspan='3'>
						<p style='text-align:center'>
							There are no inventory files
						</p>
					</td>
				</tr>
			<?php endif; ?>
        </tbody>
    </table>

</div>
