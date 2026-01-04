-- Seed Templates
-- Run this after schema.sql to populate default templates

INSERT INTO templates (name, subject, body) VALUES
(
  'QUOTE_EMAIL',
  'Your ShortFormFactory Quote',
  'Hi {name},

Thanks for reaching out about {service} editing!

Based on your needs:
- Service: {service}
- Turnaround: {turnaround}
- Volume: {volume_per_week} per week

Price: {price}

{next_step}

Ready to move forward? Order here: {order_url}

Questions? Reply to this email.

Best,
ShortFormFactory Team'
),
(
  'DM_1',
  NULL,
  'Hey {name}! Got your request for {service}. Reviewing now - will send quote within 24h. Quick question: {question}'
),
(
  'FU_1',
  'Following up on your editing request',
  'Hi {name},

Just following up on the quote I sent for {service} editing.

Do you have any questions I can answer?

The quote is good for 7 days - happy to hop on a quick call to discuss.

Best,
ShortFormFactory Team'
),
(
  'FU_2',
  'Last chance - Your ShortFormFactory quote',
  'Hi {name},

Your quote for {service} expires soon.

If timing isn''t right, no problem - but wanted to make sure you didn''t miss it.

Reply if you''d like to move forward or have questions.

Best,
ShortFormFactory Team'
),
(
  'DELIVERY_MESSAGE',
  'Your edits are ready!',
  'Hi {name},

Your {service} edits are complete!

Download: {delivery_link}

Please review and let me know if you need any revisions (1 round included).

Timeline for revisions: 24-48 hours

Happy with the result? Would love a testimonial!

Best,
ShortFormFactory Team'
),
(
  'REVISION_POLICY_MESSAGE',
  'Revision request received',
  'Hi {name},

Got your revision request for {service}.

What we can do:
- Pacing/music adjustments
- Text/caption changes
- Minor trimming

Timeline: {turnaround}

Major scope changes may require additional fee - I''ll let you know if that''s the case.

Starting on revisions now.

Best,
ShortFormFactory Team'
);
