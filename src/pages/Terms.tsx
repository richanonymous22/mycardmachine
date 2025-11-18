import { Footer } from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Terms of Service
        </h1>

        <div className="bg-card rounded-2xl shadow-xl p-8 space-y-6 border border-border/50">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using Card Costs Clever, you accept and agree to be bound by the terms 
              and provision of this agreement. If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Use of Service</h2>
            <p className="text-muted-foreground leading-relaxed">
              Card Costs Clever provides a comparison service for payment processing providers. We help 
              UK businesses compare and find the best card payment solutions. Our service is provided "as is" 
              and we make no guarantees about savings or results.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. User Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              You agree to provide accurate, current, and complete information when submitting forms or 
              applications through our service. You are responsible for maintaining the confidentiality of 
              your information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Third-Party Services</h2>
            <p className="text-muted-foreground leading-relaxed">
              We connect you with third-party payment providers. We are not responsible for the terms, 
              conditions, or performance of these third-party services. Any agreements you enter into with 
              payment providers are between you and them.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">
              All content, features, and functionality on Card Costs Clever are owned by us and are 
              protected by copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              Card Costs Clever shall not be liable for any indirect, incidental, special, consequential, 
              or punitive damages resulting from your use of or inability to use the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify these terms at any time. We will notify users of any material 
              changes by posting the new terms on this page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Contact Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about these Terms, please contact us at{" "}
              <a href="mailto:hello@cardcostsclever.co.uk" className="text-primary hover:underline">
                hello@cardcostsclever.co.uk
              </a>
            </p>
          </section>

          <p className="text-sm text-muted-foreground pt-6 border-t border-border">
            Last updated: {new Date().toLocaleDateString('en-GB')}
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Terms;