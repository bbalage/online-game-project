import { Subject } from "rxjs";
import { ActiveUser, User } from "../model/User";

///This class could be used as login user memory, username can be determined by jwt token
// the username can be broadcasted to all clients
export class ActiveUserService {
    private static activeUserTokens: Map<string, ActiveUser> = new Map<string, ActiveUser>();

    public addUser(token: string, expiresIn: number, user: User) {
        this.clearUserIfAlreadyExists(token, user);
        const activeUser: ActiveUser = {
            user: user,
            expiresAt: expiresIn + Math.floor(Date.now() / 1000)
        }
        ActiveUserService.activeUserTokens.set(token, activeUser);
    }

    public getUserName(token: string): string | null {
        if (!this.isUserActive(token)) {
            return null;
        }
        const activeUser: ActiveUser | undefined = ActiveUserService.activeUserTokens.get(token);
        if (activeUser === undefined) {
            return null;
        }
        return activeUser.user.username;
    }

    public getId(token: string): number | null {
        if (!this.isUserActive(token)) {
            return null;
        }
        const activeUser: ActiveUser | undefined = ActiveUserService.activeUserTokens.get(token);
        if (activeUser === undefined) {
            return null;
        }
        return activeUser.user.id;
    }

    public removeUser(token: string) {
        ActiveUserService.activeUserTokens.delete(token);
    }

    public isUserActive(token: string): boolean {
        const activeUser: ActiveUser | undefined = ActiveUserService.activeUserTokens.get(token);
        if (activeUser === undefined) {
            return false;
        }
        if (!this.isUserConnectionExpired(activeUser)) {
            this.removeUser(token);
            return false;
        }
        return true;
    }

    public isUserConnectionExpired(activeUser: ActiveUser): boolean {
        return activeUser.expiresAt > Math.floor(Date.now() / 1000);
    }

    private clearUserIfAlreadyExists(token: string, user: User) {
        for (let entry of ActiveUserService.activeUserTokens.entries()) {
            let key = entry[0];
            let value = entry[1];
            if (value.user.username === user.username) {
                this.removeUser(key);
            }
        }
    }
}