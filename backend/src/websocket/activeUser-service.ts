import { ActiveUser, User } from "../model/User";

///This class could be used as login user memory, username can be determined by jwt token
// the username can be broadcasted to all clients
export class ActiveUserService {
    private static activeUserTokens: Map<string, ActiveUser> = new Map<string, ActiveUser>();

    public addUser(token: string, expiresIn: number, user: User) {
        const activeUser: ActiveUser = {
            user: user,
            expiresAt: expiresIn + Math.floor(Date.now() / 1000)
        }
        ActiveUserService.activeUserTokens.set(token, activeUser);
    }

    public getUserName(token: string) {
        const activeUser: ActiveUser | undefined = ActiveUserService.activeUserTokens.get(token);
        if (activeUser !== undefined) {
            return activeUser.expiresAt > Math.floor(Date.now() / 1000) ? activeUser.user.username : null
        }
        return null;
    }
}