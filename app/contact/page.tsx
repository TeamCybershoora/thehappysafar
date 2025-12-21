import type { Metadata } from "next";

import ContactView from "./ContactView";

const CALL_NUMBER = "+919251147383";
const WHATSAPP_NUMBER = "+919251147383";
const CONTACT_EMAIL = "info@thehappysafar.com";
const OFFICE_ADDRESS = "2nd Floor, Shree Shyam Tower, C-Scheme, Jaipur, Rajasthan 302001";
const OFFICE_CITY = "Jaipur";
const MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.6755888998283!2d75.80592877609674!3d26.846693262540053!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db4094f592577%3A0x8f68132c0a918645!2sC%20Scheme%2C%20Ashok%20Nagar%2C%20Jaipur%2C%20Rajasthan%20302001!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin";

export const metadata: Metadata = {
  title: "Contact | The Happy Safar",
  description: "Connect with The Happy Safar planner desk to craft your bespoke Rajasthan itinerary.",
};

export default function ContactPage() {
  return (
    <ContactView
      callNumber={CALL_NUMBER}
      whatsappNumber={WHATSAPP_NUMBER}
      email={CONTACT_EMAIL}
      officeAddress={OFFICE_ADDRESS}
      officeCity={OFFICE_CITY}
      mapEmbedUrl={MAP_EMBED_URL}
    />
  );
}
