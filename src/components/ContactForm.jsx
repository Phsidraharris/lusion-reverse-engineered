import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    // Add success handling here (toast, etc.)
    console.log('Form submitted:', formData);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-brand-text">Send us a Message</CardTitle>
        <CardDescription>
          Fill out the form below and we'll get back to you as soon as possible.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Fields */}
          <div className="grid md:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="space-y-2"
            >
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="John"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="transition-all duration-200 focus:scale-[1.01]"
                required
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="space-y-2"
            >
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="transition-all duration-200 focus:scale-[1.01]"
                required
              />
            </motion.div>
          </div>

          {/* Email Field */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="space-y-2"
          >
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john.doe@company.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="transition-all duration-200 focus:scale-[1.01]"
              required
            />
          </motion.div>

          {/* Company Field */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="space-y-2"
          >
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              placeholder="Your Company"
              value={formData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              className="transition-all duration-200 focus:scale-[1.01]"
            />
          </motion.div>

          {/* Subject Field */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="space-y-2"
          >
            <Label htmlFor="subject">Subject</Label>
            <Select value={formData.subject} onValueChange={(value) => handleInputChange('subject', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Inquiry</SelectItem>
                <SelectItem value="technical">Technical Support</SelectItem>
                <SelectItem value="sales">Sales Question</SelectItem>
                <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          {/* Message Field */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
            className="space-y-2"
          >
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Tell us how we can help you..."
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              className="min-h-[120px] transition-all duration-200 focus:scale-[1.01]"
              required
            />
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.7 }}
          >
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 text-base bg-brand-accent hover:bg-brand-accent-hover transition-all duration-200 hover:scale-[1.02]"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Sending...</span>
                </div>
              ) : (
                'Send Message'
              )}
            </Button>
          </motion.div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;