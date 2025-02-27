<template>
<section class="grid mx-2">
  <div class="col-4 mb-2">
    <div class="flex flex-column px-1">
      <p class="mb-2">
        <strong>RUC: </strong>{{ data?.ruc }}
      </p>
      <p class="my-3">
        <strong>Fiscalía: </strong>{{ data?.fiscalia }}
      </p>
      <p class="mt-2">
        <strong>Fiscal: </strong>{{ data?.medioRecepcion }}
      </p>
    </div>
  </div>
  <div class="col-4 mb-2">
    <div class="flex flex-column px-1">
      <p class="mb-2">
        <strong>VIF: </strong>{{ data?.ruc }}
      </p>
      <p class="my-3">
        <strong>RPA: </strong>{{ data?.institucion }}
      </p>
      <p class="my-2">
        <strong>Procedimiento: </strong>{{ data?.fiscalia }}
      </p>
    </div>
  </div>
  <div class="col-4 mb-2  ">
    <div class="flex flex-column px-1">
      <p class="mb-2">
        <strong>Delito: </strong>{{ data?.medioRecepcion }}
      </p>
      <p class="my-2 flex align-items-center">
        <strong>Documento: </strong>
        <Button
          class="p-button-rounded p-button-primary mt-0 ml-2"
          icon="pi pi-file"
          type="button"
          @click="showDocument(data.documentoUrl)"
        />
      </p>
      <p class="mt-2">
        <strong>Fecha Sentencia: </strong>{{ data?.fiscalia }}
      </p>
    </div>
  </div>
  <div class="mx-3 mt-3">
    <p class="my-1">
      <strong>Detalle de la sentencia: </strong>{{ data?.fiscalia }}
    </p>
    <p>
      Lorem, ipsum dolor sit amet consectetur adipisicing elit. Illum quas deserunt voluptatem ducimus tempore totam quae repellendus ratione molestias eos rerum nihil aut explicabo asperiores dolores commodi, dignissimos reprehenderit aspernatur nisi autem labore vel magnam. Laborum sequi corporis earum tempore nihil corrupti quae, aut et labore id facilis unde architecto officiis provident assumenda tenetur inventore! Consequuntur perferendis ipsa doloremque excepturi mollitia itaque, laborum numquam quidem consectetur, dolor minima repellat hic vel! Corporis harum nobis esse enim consectetur dolorem facilis dolor doloremque perferendis nemo aliquid ad doloribus voluptates, voluptate ab velit sunt neque maiores. Atque blanditiis iste placeat vitae ipsum veniam.
    </p>
  </div>
</section>
</template>

<script setup>

</script>
