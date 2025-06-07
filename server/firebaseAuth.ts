import { Request, Response, NextFunction } from 'express';
import { storage } from './storage';

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email: string;
    displayName?: string;
    photoURL?: string;
  };
}

// Middleware para verificar se o usuário está autenticado via Firebase
export const requireFirebaseAuth = async (
  req: AuthenticatedRequest,
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
      // Criar usuário se não existir
      user = await storage.upsertUser({
        id: userClaims.sub,
        email: userClaims.email,
        displayName: userClaims.name || userClaims.email,
        photoURL: userClaims.picture,
        role: 'admin',
        isActive: true,
      });
    }

    req.user = {
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
export const getCurrentUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    const user = await storage.getUser(req.user.uid);
    
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