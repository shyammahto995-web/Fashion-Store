import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Phone, Mail, MapPin, Send, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';

interface ContactPageProps {
  onNavigate: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const { addToast } = useStore();

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Order Tracking / Inquiry');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      addToast('Please enter your name and message.', 'error');
      return;
    }
    setIsSent(true);
    addToast('Message sent! Our support team will get in touch shortly.', 'success');
    setName('');
    setMobile('');
    setEmail('');
    setMessage('');
  };

  const faqs = [
    {
      q: 'How long does delivery take across India?',
      a: 'Orders shipped to major tier-1 metros (Mumbai, Delhi-NCR, Bengaluru, Hyderabad, Chennai, Kolkata) arrive within 2 to 4 business days. Regional and tier-2/3 destinations typically arrive in 4 to 7 business days with end-to-end tracking.'
    },
    {
      q: 'Are there any hidden shipping or platform charges?',
      a: 'None whatsoever. All products ship with 100% Free Standard Shipping across India. The price you see on the product page is the final all-inclusive price.'
    },
    {
      q: 'How do I return or exchange an item?',
      a: 'We offer an easy 30-day return policy. Simply email shyammahto99665@gmail.com or contact +91 6299797984 with your Order ID, and our courier partner will arrange a complimentary doorstep pickup.'
    },
    {
      q: 'What payment modes are accepted?',
      a: 'We accept 100% Verified Cash on Delivery (COD) across all pincodes in India. Pay conveniently in cash or UPI scan at your doorstep upon receiving your parcel.'
    },
  ];

  return (
    <div id="contact-page" className="py-12 sm:py-16 bg-[#FAF9F5] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-bold tracking-[0.2em] text-[#C59B51] uppercase mb-1 block">
            WE ARE HERE TO HELP
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif-luxury text-[#0B132B] tracking-tight">
            CONTACT CUSTOMER SUPPORT
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-stone-600">
            Have questions regarding orders, sizing, exchanges, or styling advice? Reach out to our dedicated team.
          </p>
        </div>

        {/* 3 Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-[#E9E4DC] shadow-xs text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#FAF5EB] text-[#C59B51] mx-auto flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">Phone Support</h3>
            <p className="text-sm font-bold text-[#0B132B]">
              <a href="tel:6299797984" className="hover:text-[#C59B51] transition-colors">+91 6299797984</a>
            </p>
            <p className="text-xs text-stone-500">Mon - Sat: 9:30 AM to 7:00 PM IST</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#E9E4DC] shadow-xs text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#FAF5EB] text-[#C59B51] mx-auto flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">Email Inquiries</h3>
            <p className="text-sm font-bold text-[#0B132B]">
              <a href="mailto:shyammahto99665@gmail.com" className="hover:text-[#C59B51] transition-colors break-all">shyammahto99665@gmail.com</a>
            </p>
            <p className="text-xs text-stone-500">Response within 4-6 business hours</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#E9E4DC] shadow-xs text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#FAF5EB] text-[#C59B51] mx-auto flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">Store Location</h3>
            <p className="text-xs font-semibold text-stone-800">High Street Phoenix, Lower Parel</p>
            <p className="text-xs text-stone-500">Mumbai, Maharashtra 400013</p>
          </div>
        </div>

        {/* Contact Form & FAQs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-[#E9E4DC] shadow-xs space-y-5">
            <h2 className="text-lg font-bold text-[#0B132B] uppercase tracking-wider pb-2 border-b border-stone-200">
              SEND US A MESSAGE
            </h2>

            {isSent ? (
              <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-200 text-center space-y-2">
                <MessageSquare className="w-8 h-8 text-emerald-600 mx-auto" />
                <h3 className="text-sm font-bold text-emerald-900">Message Received!</h3>
                <p className="text-xs text-emerald-700">
                  Thank you for reaching out. One of our customer care specialists will reply to your registered contact shortly.
                </p>
                <button
                  onClick={() => setIsSent(false)}
                  className="mt-3 text-xs font-bold text-emerald-800 underline"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Verma"
                      required
                      className="w-full px-3.5 py-2.5 rounded-md border border-stone-300 text-sm focus:outline-hidden focus:border-[#0B132B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="9876543210"
                      className="w-full px-3.5 py-2.5 rounded-md border border-stone-300 text-sm focus:outline-hidden focus:border-[#0B132B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="rahul@example.com"
                      className="w-full px-3.5 py-2.5 rounded-md border border-stone-300 text-sm focus:outline-hidden focus:border-[#0B132B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Subject
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-md border border-stone-300 text-sm bg-white focus:outline-hidden focus:border-[#0B132B]"
                    >
                      <option value="Order Tracking / Inquiry">Order Tracking / Inquiry</option>
                      <option value="Return / Exchange Request">Return / Exchange Request</option>
                      <option value="Product Details & Sizing">Product Details &amp; Sizing</option>
                      <option value="Bulk / Corporate Orders">Bulk / Corporate Orders</option>
                      <option value="Other">Other Query</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Your Message *
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we assist you today? Please include your Order ID if referencing a purchase."
                    required
                    className="w-full px-3.5 py-2.5 rounded-md border border-stone-300 text-sm focus:outline-hidden focus:border-[#0B132B]"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-[#0B132B] hover:bg-[#1E293B] text-white rounded-md text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <Send className="w-4 h-4 text-[#E5C384]" />
                  <span>SUBMIT INQUIRY</span>
                </button>
              </form>
            )}
          </div>

          {/* FAQs */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-lg font-bold text-[#0B132B] uppercase tracking-wider pb-2 border-b border-stone-200">
              FREQUENTLY ASKED QUESTIONS
            </h2>

            <div className="space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div key={index} className="bg-white rounded-xl border border-[#E9E4DC] overflow-hidden shadow-2xs">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full px-4 py-3.5 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-[#0B132B] hover:bg-stone-50"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-[#C59B51] shrink-0" /> : <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />}
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 text-xs text-stone-600 leading-relaxed border-t border-stone-100">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
