USE job_portal;

INSERT INTO jobs (title, company, location, category, type, salary, remote, description)
VALUES
  ('Product Manager', 'BrightEdge', 'London, UK', 'Product', 'Full-time', '£65,000 - £75,000', true, 'Lead product strategy with cross-functional teams to launch new hiring solutions.'),
  ('Marketing Specialist', 'CreativeWorks', 'Berlin, Germany', 'Marketing', 'Contract', '€40,000 - €50,000', false, 'Develop and execute marketing campaigns for growing brand portfolios.'),
  ('Software Engineer', 'NovaTech', 'San Francisco, CA', 'Engineering', 'Full-time', '$120,000 - $145,000', true, 'Build scalable full-stack applications with a modern JavaScript stack.'),
  ('Sales Representative', 'SummitRecruit', 'New York, NY', 'Sales', 'Full-time', '$55,000 - $70,000', false, 'Drive B2B sales growth for talent acquisition products in the US market.'),
  ('UX Designer', 'UserWave', 'Remote', 'Design', 'Part-time', '$45,000 - $55,000', true, 'Craft intuitive user experiences for job seeker and recruiter portals.');
