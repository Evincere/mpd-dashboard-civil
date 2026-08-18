import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../../domain/entities/User';

const JWT_SECRET = process.env.JWT_SECRET || 'defensoria-secret-key';

export class LoginUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(emailOrInitials: string, passwordString: string) {
    let user = await this.userRepository.findByEmail(emailOrInitials);
    if (!user) {
      user = await this.userRepository.findByInitials(emailOrInitials.toLowerCase());
    }

    if (!user || !user.password) {
      throw new Error('Credenciales inválidas');
    }

    const isValidPassword = await bcrypt.compare(passwordString, user.password);
    if (!isValidPassword) {
      throw new Error('Credenciales inválidas');
    }

    const token = jwt.sign(
      { 
        id: user.id, 
        role: user.role,
        initials: user.initials,
        name: user.name
      },
      JWT_SECRET,
      { expiresIn: '12h' }
    );

    // Return user without password
    const { password, ...userWithoutPassword } = user;
    
    return {
      token,
      user: userWithoutPassword
    };
  }
}
