// types/express-session.d.ts
import 'express-session';

declare module 'express-session' {
  interface SessionData {
    user: { role: string }; // Добавляем ваше пользовательское поле
  }
}

declare module 'express' {
  interface Request {
    session: Session & Partial<SessionData>;
  }
}
