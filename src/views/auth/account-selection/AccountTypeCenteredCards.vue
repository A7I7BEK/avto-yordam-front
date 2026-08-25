<script
  setup
  lang="ts"
>
import { ArrowRight, Building2, Check, UserRound } from '@lucide/vue';
import { useRouter } from 'vue-router';

const router = useRouter();

function goToProfessional() {
  router.push({ name: 'auth-login', query: { type: 'professional' } });
}

function goToBusiness() {
  router.push({ name: 'auth-login', query: { type: 'business' } });
}
</script>

<template>
  <div class="page">
    <!-- Decorative blobs -->
    <div class="blob blob-top-left" />
    <div class="blob blob-bottom-right" />

    <div class="content">
      <!-- Heading -->
      <div class="heading">
        <h1>Choose your account type</h1>
        <p>
          Choose the account type that fits you best. This tailors your whole
          experience — you can always change it later.
        </p>
      </div>

      <!-- Cards Row -->
      <div class="cards-row">
        <!-- Professional Card -->
        <div class="card">
          <div class="card-header">
            <div class="icon-box icon-box-pro">
              <UserRound
                :size="30"
                color="var(--primary-foreground)"
              />
            </div>
            <span class="badge">For individuals</span>
          </div>

          <h2 class="card-title">Professional</h2>
          <p class="card-desc">
            Work independently — accept jobs near you, set your own rates and
            grow your reputation.
          </p>

          <div class="divider" />

          <div class="features">
            <div class="feature-row">
              <div class="check-circle">
                <Check
                  :size="13"
                  color="var(--primary)"
                />
              </div>
              <span>Set your own rates &amp; schedule</span>
            </div>
            <div class="feature-row">
              <div class="check-circle">
                <Check
                  :size="13"
                  color="var(--primary)"
                />
              </div>
              <span>Get matched with nearby jobs</span>
            </div>
            <div class="feature-row">
              <div class="check-circle">
                <Check
                  :size="13"
                  color="var(--primary)"
                />
              </div>
              <span>Fast payouts after every job</span>
            </div>
          </div>

          <button
            class="cta-button"
            type="button"
            @click="goToProfessional"
          >
            <span>Continue as Pro</span>
            <ArrowRight
              :size="18"
              color="var(--primary-foreground)"
            />
          </button>
        </div>

        <!-- Business Card -->
        <div class="card">
          <div class="card-header">
            <div class="icon-box icon-box-biz">
              <Building2
                :size="30"
                color="var(--background)"
              />
            </div>
            <span class="badge">For companies</span>
          </div>

          <h2 class="card-title">Business</h2>
          <p class="card-desc">
            Manage your auto service — handle bookings, team, earnings and grow
            your business.
          </p>

          <div class="divider" />

          <div class="features">
            <div class="feature-row">
              <div class="check-circle">
                <Check
                  :size="13"
                  color="var(--primary)"
                />
              </div>
              <span>Manage your team &amp; schedule</span>
            </div>
            <div class="feature-row">
              <div class="check-circle">
                <Check
                  :size="13"
                  color="var(--primary)"
                />
              </div>
              <span>Track earnings &amp; transactions</span>
            </div>
            <div class="feature-row">
              <div class="check-circle">
                <Check
                  :size="13"
                  color="var(--primary)"
                />
              </div>
              <span>Grow with customer reviews</span>
            </div>
          </div>

          <button
            class="cta-button"
            type="button"
            @click="goToBusiness"
          >
            <span>Continue as Business</span>
            <ArrowRight
              :size="18"
              color="var(--primary-foreground)"
            />
          </button>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <span class="footer-text">Already have an account?</span>
        <button
          class="footer-link"
          type="button"
          @click="goToProfessional"
        >
          Sign in
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  background: var(--background);
}

.blob {
  position: absolute;
  pointer-events: none;
  border-radius: 50%;
}

.blob-top-left {
  top: -320px;
  left: -240px;
  width: 880px;
  height: 880px;
  background: var(--primary);
  opacity: 0.08;
  filter: blur(100px);
}

.blob-bottom-right {
  right: -240px;
  bottom: -320px;
  width: 760px;
  height: 760px;
  background: var(--primary);
  opacity: 0.07;
  filter: blur(100px);
}

.content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 44px;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
  padding: 44px 24px;
}

.heading {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  width: 620px;
  max-width: 100%;
  text-align: center;
}

.heading h1 {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 38px;
  font-weight: 700;
  color: var(--foreground);
}

.heading p {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  color: var(--muted-foreground);
}

.cards-row {
  display: flex;
  flex-wrap: wrap;
  gap: 28px;
  justify-content: center;
  width: 100%;
}

.card {
  display: flex;
  flex-direction: column;
  gap: 22px;
  width: 400px;
  max-width: 100%;
  padding: 32px;
  background: var(--card);
  border: 1px solid var(--border-soft);
  border-radius: 40px;
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.059);
}

@media (max-width: 640px) {
  .content {
    padding: 32px 16px;
    gap: 24px;
  }

  .heading h1 {
    font-size: 26px;
  }

  .heading p {
    font-size: 14px;
  }

  .card {
    padding: 24px 18px;
    border-radius: 24px;
    gap: 18px;
  }
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.icon-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 24px;
}

.icon-box-pro {
  background: var(--primary);
}

.icon-box-biz {
  background: var(--foreground);
}

.badge {
  padding: 6px 12px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: var(--muted-foreground);
  background: var(--muted);
  border-radius: 999px;
}

.card-title {
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: var(--foreground);
}

.card-desc {
  min-height: 42px;
  margin: 0;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  color: var(--muted-foreground);
}

.divider {
  width: 100%;
  height: 1px;
  background: var(--border-soft);
}

.features {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.feature-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

.feature-row span {
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: var(--foreground);
}

.check-circle {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  background: rgba(87, 73, 244, 0.102);
  border-radius: 999px;
}

.cta-button {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 16px 20px;
  font-family: Inter, sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: var(--primary-foreground);
  cursor: pointer;
  background: var(--primary);
  border: none;
  border-radius: 999px;
  transition: opacity 0.15s;
}

.cta-button:hover {
  opacity: 0.9;
}

.footer {
  display: flex;
  gap: 6px;
  align-items: center;
}

.footer-text {
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: var(--muted-foreground);
}

.footer-link {
  padding: 0;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: var(--primary);
  cursor: pointer;
  background: none;
  border: none;
}

.footer-link:hover {
  text-decoration: underline;
}
</style>
