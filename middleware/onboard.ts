export default defineNuxtRouteMiddleware((to) => {
  
  const excludedRoutes = ['auth-login', 'auth-register', 'onboarding'];

  if (excludedRoutes.includes(to.name)) return;

  const user = useSupabaseUser();

  if (!user.value) {
    // go to /onboarding
    return navigateTo('/onboarding');
  }
});
