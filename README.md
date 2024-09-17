Send an email once an item is added to / removed from your [ncore.pro hit'n'run queue](https://ncore.pro/hitnrun.php).

This tool uses the [ncore-api](https://www.npmjs.com/package/ncore-api) tool of [kalacs](https://www.npmjs.com/~kalacs) to query the [ncore.pro](https://ncore.pro) torrent website.

It uses [GitHub Actions](https://github.com/features/actions) to run a workflow on GitHub servers to check your [ncore.pro hit'n'run queue](https://ncore.pro/hitnrun.php), and, based on the changes thereof, send an email using [nodemailer](https://nodemailer.com/about/) with your selected email provider to the email address of your choice.

With its basic setup, it will run every 30 minutes, and will email you:
- If a new item is added to your queue.
- If an item has been removed including the title of the item removed.
- If the queue becomes empty.

### Usage

Fork this repo, then add environment variables under Repository Settings > Secrets and variables > Actions (`https://github.com/<username>/<reponame>/settings/secrets/actions`):

| Name                   | Description                                                       |
|------------------------|-------------------------------------------------------------------|
| NCORE_USERNAME         | Your ncore.pro username                                           |
| NCORE_PASSWORD         | Your ncore.pro password                                           |
| EMAIL_SENDER_HOST      | The SMTP (sending) host name of your email sending provider*      |
| EMAIL_SENDER_USER      | The username used to authenticate to your email sending provider* | 
| EMAIL_SENDER_PASSWORD  | The password used to authenticate to your email sending provider* |                                                 
| EMAIL_SENDER_RECIPIENT | The email address you want the notifications to go to             |

_* I recommend using [Zoho](https://go.zoho.com/xEA) Mail as the email sender. Would you choose to go with them, you can find more info on settings on [the Zoho Mail Admin Console](https://mailadmin.zoho.eu/cpanel/home.do#mailSettings/toolsAndConfiguration/configurations) and [the relevant help article](https://www.zoho.com/mail/help/zoho-smtp.html). Note that while this will all work with a fee account, if you purchase something from Zoho using [this link](https://go.zoho.com/xEA), I do receive credit from your first purchase ([Zoho's referral program is described here](https://www.zoho.com/r/refer-a-friend.html))._

### Change schedule / triggering event

You can change the frequency of the GitHub Action running in `.github/workflows/query_and_email.yml` file using the crontab scheduler. You may find [this crontab tool](https://crontab.guru/#*/30_*_*_*_*) useful.

```yml
#.github/workflows/query_and_email.yml

schedule:
  - cron: '*/30 * * * *'
```

You can, of course, change the workflow to be triggered by any other event of your choice (more info on this can be found [here](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows)).

### GitHub Billing

It is important to note that running GitHub Actions, which this small solution is based on, will consume minutes from your GitHub account balance, which includes some free minutes, but if you go beyond that, it would incur cost. On the account I'm using this on I have no other actions running, but have this one active, and have the workflow set to run every 30 minutes, as you can see, with which, according to my calculations, I will end up spending just below the free limit at the end of the billing cycle (monthly). You can always check your current spend under [\[GitHub Account\] Settings > Billing and plans > Plans and usage](https://github.com/settings/billing). Here is more info on [GitHub's billing for Actions, specifically the included storage and minutes](https://docs.github.com/en/billing/managing-billing-for-github-actions/about-billing-for-github-actions#included-storage-and-minutes).