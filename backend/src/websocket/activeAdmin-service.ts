import { ActiveUser, User } from "../model/User";

export interface TokenSwitch {
    oldToken: string,
    newToken: string
}

export class ActiveAdminService {
    private static activeAdmin: ActiveUser | undefined;

    public setAdmin(token: string, expiresIn: number, user: User) {
        this.removeUser(token);
        const activeUser: ActiveUser = {
            user: user,
            expiresAt: expiresIn + Math.floor(Date.now() / 1000)
        }
        ActiveAdminService.activeAdmin = activeUser;
    }

    public getUserName(token: string): string | null {
        if (!this.isUserActive(token)) {
            return null;
        }
        const activeUser: ActiveUser | undefined = ActiveAdminService.activeAdmin;
        if (activeUser === undefined) {
            return null;
        }
        return activeUser.user.username;
    }

    public getId(token: string): number | null {
        if (!this.isUserActive(token)) {
            return null;
        }
        const activeUser: ActiveUser | undefined = ActiveAdminService.activeAdmin;
        if (activeUser === undefined) {
            return null;
        }

        return activeUser.user.id;
    }

    public removeUser(token: string) {
        ActiveAdminService.activeAdmin = undefined;
    }

    public isUserActive(token: string): boolean {
        const activeUser: ActiveUser | undefined = ActiveAdminService.activeAdmin;
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
}