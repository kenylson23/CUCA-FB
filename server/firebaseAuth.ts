import { Request, Response, NextFunction, RequestHandler } from 'express';
import { storage } from './storage';

declare global {
  namespace Express {
    interface Request {
      firebaseUser?: {
        uid: string;
        email: string;
        displayName?: string;
        photoURL?: string;
      };
    }
  }
}

// Middleware para verificar se o usuário está autenticado via Firebase
export const requireFirebaseAuth: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token de autorização necessário' });
    }

    const idToken = authHeader.split('Bearer ')[1];
    
    // Para este exemplo, vamos confiar no token do frontend
    // Em produção, você deve verificar o token usando Firebase Admin SDK
    const userClaims = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString());
    
    if (!userClaims.sub || !userClaims.email) {
      return res.status(401).json({ message: 'Token inválido' });
    }

    // Buscar ou criar o usuário no banco de dados
    let user = await storage.getUser(userClaims.sub);
    
    if (!user) {
      // Determinar role baseado no email - pode ser configurado conforme necessário
      const isAdminEmail = userClaims.email && (
        userClaims.email.includes('admin') || 
        userClaims.email === 'your-admin-email@gmail.com' // Configure seu email admin aqui
      );
      
      // Criar usuário se não existir
      user = await storage.upsertUser({
        id: userClaims.sub,
        email: userClaims.email,
        displayName: userClaims.name || userClaims.email,
        photoURL: userClaims.picture,
        role: isAdminEmail ? 'admin' : 'user',
        isActive: true,
      });
    }

    req.firebaseUser = {
      uid: user.id,
      email: user.email || '',
      displayName: user.displayName || undefined,
      photoURL: user.photoURL || undefined,
    };

    next();
  } catch (error) {
    console.error('Erro na autenticação:', error);
    res.status(401).json({ message: 'Token inválido' });
  }
};

// Rota para obter informações do usuário autenticado
export const getCurrentUser: RequestHandler = async (req: Request, res: Response) => {
  try {
    if (!req.firebaseUser) {
      return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    const user = await storage.getUser(req.firebaseUser.uid);
    
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json({
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      role: user.role,
      isActive: user.isActive,
    });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};