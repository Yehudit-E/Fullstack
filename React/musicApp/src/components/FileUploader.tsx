import React, { useState } from 'react';
import axios from 'axios';
import api from '../interceptor/api';

const FileUploader = () => {
  const [file, setFile] = useState<File | null>(null);  // סטייט לשמירת הקובץ שנבחר
  const [progress, setProgress] = useState(0);  // סטייט להצגת ההתקדמות

  // פונקציה לבחירת קובץ
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);  // עדכון הקובץ שנבחר
    }
  };

  // פונקציה להעלאת הקובץ
  const handleUpload = async () => {
    if (!file) return;  // אם אין קובץ, אין מה להעלות

    try {
      console.log(file);
      console.log(file.name);
      console.log(file.type);

      
      // שלב 1: בקשת Presigned URL מהשרת
      const res = await api.get('Creation/upload-url', {
        params: {
          fileName: file.name,  // שם הקובץ
          contentType: file.type,  // סוג הקובץ
        }
      });

      const presignedUrl = res.data.url;  // קבלת ה-Presigned URL מהשרת

      // שלב 2: העלאת הקובץ ל-S3
      await axios.put(presignedUrl, file, {
        headers: {
          'Content-Type': file.type,  // סוג הקובץ
        },
        onUploadProgress: (progressEvent) => {
          // חישוב אחוז ההתקדמות
          const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setProgress(percent);  // עדכון סטייט ההתקדמות
        },
      });

      // שלב 3: אם יש צורך, שמירת פרטי הקובץ במערכת
      // לדוגמה אם אתה רוצה לשמור את ה-URL של הקובץ, שם הקובץ וכו'
      // const res2 = await axios.post('https://localhost:7143/api/Creation', {
      //   UserId: userId,
      //   FileName: file.name,
      //   FileType: file.type,
      //   ImageUrl: presignedUrl,  // כתובת ה-URL של הקובץ ב-S3
      // }, {
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`
      //   }
      // });

      alert('הקובץ הועלה בהצלחה!');  // הצגת הודעה לאחר ההעלאה
    } catch (error) {
      console.error('שגיאה בהעלאה:', error);  // טיפול בשגיאות
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />  {/* בחירת קובץ */}
      <button onClick={handleUpload}>העלה קובץ</button>  {/* כפתור להעלאה */}
      {progress > 0 && <div>התקדמות: {progress}%</div>}  {/* הצגת אחוז ההתקדמות */}
    </div>
  );
};

export default FileUploader;
