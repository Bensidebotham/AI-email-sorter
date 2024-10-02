import { useState } from 'react';

import styles from './EmailSorter.module.css'; // Importing the CSS module for styling

const EmailSorter = () => {
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/sort-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    setCategory(data.category);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Email Sorter</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <label htmlFor="email" className={styles.label}>Enter Email HTML or Text:</label>
        <textarea
          id="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Paste your email content or HTML here"
          className={styles.textarea}
          rows="10"
        />

        <button type="submit" className={styles.button}>Sort Email</button>
      </form>

      {category && (
        <div className={styles.result}>
          <h2>Category</h2>
          <p>{category}</p>
        </div>
      )}
    </div>
  );
};

export default EmailSorter;
