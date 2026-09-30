<template>
  <div
    class="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-16"
    role="status"
    aria-live="polite"
    aria-busy="true"
  >
    <span class="sr-only">Loading cart</span>

    <aside
      class="order-first w-full shrink-0 lg:order-2 lg:sticky lg:top-24 lg:w-80 xl:w-96"
    >
      <div class="rounded-xl border border-gray-200 bg-gray-50/50 p-6">
        <div class="h-6 w-40 animate-pulse rounded bg-gray-200" />
        <div class="mt-5 flex flex-col">
          <div
            v-for="i in 3"
            :key="i"
            class="flex items-center justify-between border-b border-gray-200 py-3"
          >
            <div class="h-4 w-20 animate-pulse rounded bg-gray-200" />
            <div class="h-4 w-16 animate-pulse rounded bg-gray-200" />
          </div>
          <div class="flex items-center justify-between pt-4">
            <div class="h-5 w-16 animate-pulse rounded bg-gray-200" />
            <div class="h-7 w-24 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
        <div class="mt-4 h-11 w-full animate-pulse rounded-md bg-gray-200" />
      </div>
      <div
        class="mt-4 rounded-xl border border-gray-200 bg-gray-50/50 p-6 lg:mt-6"
      >
        <div class="h-6 w-44 animate-pulse rounded bg-gray-200" />
      </div>
    </aside>

    <div class="order-2 min-w-0 flex-1 lg:order-1">
      <div
        class="md:grid md:grid-cols-[minmax(0,1fr)_7rem_8rem_7rem] md:gap-x-6"
      >
        <CartItemsColumnHeaders class="max-xl:hidden" />
        <article
          v-for="i in 4"
          :key="i"
          class="w-full min-w-0 border-b border-gray-100 py-6 md:col-span-full xl:grid xl:grid-cols-subgrid xl:items-center"
        >
          <div class="flex min-w-0 items-center gap-4">
            <div
              class="h-20 w-20 shrink-0 animate-pulse rounded-lg bg-gray-200"
            />
            <div class="min-w-0 flex-1">
              <div class="h-5 w-3/4 max-w-56 animate-pulse rounded bg-gray-200" />
              <div
                class="mt-2 h-4 w-full max-w-72 animate-pulse rounded bg-gray-200"
              />
            </div>
          </div>
          <div
            class="mt-4 h-5 w-14 animate-pulse rounded bg-gray-200 xl:mt-0"
          />
          <div
            class="mt-4 h-9 w-30 animate-pulse rounded-md bg-gray-200 xl:mt-0"
          />
          <div
            class="mt-4 ml-auto h-5 w-16 animate-pulse rounded bg-gray-200 xl:mt-0"
          />
        </article>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CartItemsColumnHeaders from "./CartItemsColumnHeaders.vue";
</script>
