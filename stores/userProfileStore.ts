// stores/useProfileStore.js
import { defineStore } from 'pinia';

interface ProfileResponse {
  profile?: {
    id: number;
    bio: string | null;
    userId: string;
    name: string | null;
  };
  error?: string;
}

export const useProfileStore = defineStore('user-profile-store', {
  state: () => ({
    bio: '',
  }),
  actions: {
    async fetchBio() {
      if (this.bio) return;

      const { data } = await useFetch<ProfileResponse>('/api/profile');

      if (data.value && 'profile' in data.value && data.value.profile) {
        if (data.value.profile.bio) this.bio = data.value.profile.bio;
      }
    },
    updateBio(newBio: string) {
      this.bio = newBio;

      $fetch('api/update-bio', {
        method: 'POST',
        body: JSON.stringify({
          bio: newBio,
        }),
      });
    },
  },
});
