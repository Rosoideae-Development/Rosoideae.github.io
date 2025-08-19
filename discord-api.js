
class DiscordTeamsManager {
    constructor() {
        this.botToken = ''; 
        this.guildId = ''; 
        this.teamRoles = {
            'main': {
                'duelist': 'Main Duelist',
                'controller': 'Main Controller', 
                'initiator': 'Main Initiator',
                'sentinel': 'Main Sentinel',
                'flex': 'Main Flex',
                'captain': 'Main Team Captain'
            },
            'academy': {
                'duelist': 'Academy Duelist',
                'controller': 'Academy Controller', 
                'initiator': 'Academy Initiator',
                'sentinel': 'Academy Sentinel',
                'flex': 'Academy Flex',
                'captain': 'Academy Captain'
            },
            'scrim': {
                'duelist': 'Scrim Duelist',
                'controller': 'Scrim Controller', 
                'initiator': 'Scrim Initiator',
                'sentinel': 'Scrim Sentinel',
                'flex': 'Scrim Flex',
                'captain': 'Scrim Captain'
            }
        };
        this.mainTeamGrid = document.getElementById('main-team-grid');
        this.academyTeamGrid = document.getElementById('academy-team-grid');
        this.scrimTeamGrid = document.getElementById('scrim-team-grid');
        this.statusText = document.getElementById('discord-status-text');
        this.refreshBtn = document.getElementById('refresh-teams');
        
        this.init();
    }

    init() {
        if (this.refreshBtn) {
            this.refreshBtn.addEventListener('click', () => this.refreshAllTeams());
        }
        
        // Auto-refresh every 5 minutes
        setInterval(() => this.refreshAllTeams(), 300000);
        
        // Initial load
        this.refreshAllTeams();
    }

    async refreshAllTeams() {
        if (!this.botToken || !this.guildId) {
            this.showError('You need to set up the Discord bot first. Check the setup guide for help.');
            return;
        }

        this.showLoading();
        
        try {
            const allMembers = await this.fetchTeamMembers();
            this.displayAllTeams(allMembers);
            this.updateStatus('Connected - All teams updated');
        } catch (error) {
            console.error('Something went wrong while getting team info:', error);
            this.showError('Something went wrong getting the team info. Check the console if you want to see the details.');
        }
    }

    async fetchTeamMembers() {
        const response = await fetch(`https://discord.com/api/v10/guilds/${this.guildId}/members`, {
            headers: {
                'Authorization': `Bot ${this.botToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Discord API error: ${response.status}`);
        }

        const members = await response.json();
        return this.filterTeamMembers(members);
    }

    filterTeamMembers(members) {
        const allTeamMembers = {
            main: [],
            academy: [],
            scrim: []
        };
        
        members.forEach(member => {
            const teamInfo = this.getTeamAndRole(member.roles);
            if (teamInfo) {
                allTeamMembers[teamInfo.team].push({
                    id: member.user.id,
                    username: member.user.username,
                    displayName: member.nick || member.user.username,
                    avatar: member.user.avatar,
                    role: teamInfo.role,
                    team: teamInfo.team,
                    roles: member.roles
                });
            }
        });

        // Sort each team by role priority
        const rolePriority = ['captain', 'duelist', 'controller', 'initiator', 'sentinel', 'flex'];
        Object.keys(allTeamMembers).forEach(team => {
            allTeamMembers[team].sort((a, b) => {
                return rolePriority.indexOf(a.role) - rolePriority.indexOf(b.role);
            });
        });

        return allTeamMembers;
    }

    getTeamAndRole(memberRoles) {
        for (const [teamKey, teamRoles] of Object.entries(this.teamRoles)) {
            for (const [roleKey, roleName] of Object.entries(teamRoles)) {
                if (memberRoles.includes(roleName)) {
                    return { team: teamKey, role: roleKey };
                }
            }
        }
        return null;
    }

    displayAllTeams(allMembers) {
        // Display Main Team
        this.displayTeamSection(this.mainTeamGrid, allMembers.main, 'main');
        
        // Display Academy Team
        this.displayTeamSection(this.academyTeamGrid, allMembers.academy, 'academy');
        
        // Display Scrim Team
        this.displayTeamSection(this.scrimTeamGrid, allMembers.scrim, 'scrim');
    }

    displayTeamSection(teamGrid, members, teamType) {
        if (!members || members.length === 0) {
            teamGrid.innerHTML = '<div class="no-members">No members in this team yet.</div>';
            return;
        }

        teamGrid.innerHTML = members.map(member => `
            <div class="team-member discord-member" data-member-id="${member.id}" data-team="${teamType}">
                <div class="member-avatar">
                    ${this.getAvatarHTML(member.avatar, member.id)}
                </div>
                <h3>${this.escapeHtml(member.displayName)}</h3>
                <div class="discord-role">${this.teamRoles[teamType][member.role]}</div>
                <div class="discord-username">@${member.username}</div>
            </div>
        `).join('');
    }

    getAvatarHTML(avatar, userId) {
        if (avatar) {
            return `<img src="https://cdn.discordapp.com/avatars/${userId}/${avatar}.png" alt="Avatar" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />`;
        }
        return '👤';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showLoading() {
        if (this.mainTeamGrid) this.mainTeamGrid.innerHTML = '<div class="loading-indicator">Rounding up the main team...</div>';
        if (this.academyTeamGrid) this.academyTeamGrid.innerHTML = '<div class="loading-indicator">Rounding up the academy team...</div>';
        if (this.scrimTeamGrid) this.scrimTeamGrid.innerHTML = '<div class="loading-indicator">Rounding up the scrim team...</div>';
        this.updateStatus('Connecting to Discord...');
    }

    showError(message) {
        const errorMessage = `<div class="error-message">Something went wrong: ${message}</div>`;
        if (this.mainTeamGrid) this.mainTeamGrid.innerHTML = errorMessage;
        if (this.academyTeamGrid) this.academyTeamGrid.innerHTML = errorMessage;
        if (this.scrimTeamGrid) this.scrimTeamGrid.innerHTML = errorMessage;
        this.updateStatus('Couldn\'t connect');
    }

    updateStatus(status) {
        if (this.statusText) {
            this.statusText.textContent = `Discord: ${status}`;
        }
    }
}

// Configuration section - EDIT THESE VALUES
const DISCORD_CONFIG = {
    botToken: '', // Your Discord bot token
    guildId: '',  // Your Discord server ID
    teamRoles: {
        'main': {
            'duelist': 'Main Duelist',      // Role name in Discord
            'controller': 'Main Controller', 
            'initiator': 'Main Initiator',
            'sentinel': 'Main Sentinel',
            'flex': 'Main Flex',
            'captain': 'Main Team Captain'
        },
        'academy': {
            'duelist': 'Academy Duelist',      // Role name in Discord
            'controller': 'Academy Controller', 
            'initiator': 'Academy Initiator',
            'sentinel': 'Academy Sentinel',
            'flex': 'Academy Flex',
            'captain': 'Academy Captain'
        },
        'scrim': {
            'duelist': 'Scrim Duelist',      // Role name in Discord
            'controller': 'Scrim Controller', 
            'initiator': 'Scrim Initiator',
            'sentinel': 'Scrim Sentinel',
            'flex': 'Scrim Flex',
            'captain': 'Scrim Captain'
        }
    }
};

// Initialize Discord integration when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Set configuration
    if (DISCORD_CONFIG.botToken && DISCORD_CONFIG.guildId) {
        window.discordTeamsManager = new DiscordTeamsManager();
    } else {
        console.warn('Discord bot setup needed. Add your bot token and guild ID in discord-api.js');
        document.getElementById('discord-status-text').textContent = 'Discord: Bot not set up yet';
    }
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DiscordTeamsManager;
}
