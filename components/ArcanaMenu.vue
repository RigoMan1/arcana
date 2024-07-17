<script setup lang="ts">
const user = useSupabaseUser();

const supabase = useSupabaseClient();

const logout = async () => {
  await supabase.auth.signOut();
  navigateTo('/auth/login');
};

const menuItems = [
  {
    label: 'Settings',
    icon: 'fluent:settings-20-filled',
    action: () => navigateTo('/settings'),
  },
  {
    label: 'Logout',
    icon: 'fluent:sign-out-20-filled',
    action: logout,
  },
  // create an account if user is anonymous
  {
    label: 'Create Account',
    icon: 'fluent:person-add-20-filled',
    action: () => navigateTo('/auth/register'),
  },
  // pricacy policy
  {
    label: 'Privacy Policy',
    icon: 'fluent:lock-20-filled',
    action: () => navigateTo('/privacy-policy'),
  },
];
</script>

<template>
  <div>
    <v-menu
      transition="scale-transition"
      width="240"
    >
      <template #activator="{ props: activatorProps }">
        <arcana-button
          v-bind="activatorProps"
          size="sm"
          variant="text"
          icon
          class="relative"
        >
          <Icon
            name="fluent:settings-20-filled"
            size="2em"
          />
        </arcana-button>
      </template>
      <template #default>
        <div class="arcana-card-alt">
          <!-- your signed in as anon user id -->
          <div v-if="user?.is_anonymous">
            <p class="text-xs">Signed in as anonymous user</p>
            <p class="text-xs opacity-75 mt-1">{{ user?.id }}</p>
          </div>

          <h6
            v-else
            class="text-lg font-medium capitalize"
          >
            {{ user?.email?.split('@')[0] }}
          </h6>

          <hr class="mt-2 mb-4 opacity-20 -mx-4" />

          <div class="space-y-1">
            <nuxt-link
              v-if="user?.is_anonymous"
              class="w-full flex items-center p-2 text-sm hover:bg-secondary-500 hover:bg-opacity-25
                rounded transition-colors duration-100 ease-in-out"
              to="/auth/register"
            >
              <Icon
                name="fluent:person-add-20-filled"
                size="1.5rem"
              />
              <span class="ml-4"> Create Account </span>
            </nuxt-link>

            <nuxt-link
              class="w-full flex items-center p-2 text-sm hover:bg-secondary-500 hover:bg-opacity-25
                rounded transition-colors duration-100 ease-in-out"
              to="/settings"
            >
              <Icon
                name="fluent:settings-20-filled"
                size="1.5rem"
              />

              <span class="ml-4"> Settings </span>
            </nuxt-link>

            <nuxt-link
              class="w-full flex items-center p-2 text-sm hover:bg-secondary-500 hover:bg-opacity-25
                rounded transition-colors duration-100 ease-in-out"
              to="/privacy-policy"
            >
              <Icon
                name="fluent:lock-20-filled"
                size="1.5rem"
              />
              <span class="ml-4"> Privacy Policy </span>
            </nuxt-link>

            <nuxt-link
              v-if="!user?.is_anonymous"
              class="w-full flex items-center p-2 text-sm hover:bg-secondary-500 hover:bg-opacity-25
                rounded transition-colors duration-100 ease-in-out"
              @click="logout"
            >
              <Icon
                name="fluent:sign-out-20-filled"
                size="1.5rem"
              />
              <span class="ml-4"> Logout </span>
            </nuxt-link>
          </div>
        </div>
      </template>
    </v-menu>
  </div>
</template>

<style></style>
