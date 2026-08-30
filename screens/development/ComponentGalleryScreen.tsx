import { GachaSlider } from '@/components/special/GachaSlider'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Icon } from '@/components/ui/icon'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  type Option
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Text } from '@/components/ui/text'
import { Toggle, ToggleIcon } from '@/components/ui/toggle'
import type { AuthStackParamList } from '@/navigation/AuthNavigator'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Bell, Bold, Info, Settings, Sparkles, TriangleAlert } from 'lucide-react-native'
import React, { memo, useCallback, useState, type ReactNode } from 'react'
import { ScrollView, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type GalleryNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Development'>

type SectionProps = {
  title: string
  children: ReactNode
}

const Section = ({ title, children }: SectionProps) => (
  <View className="gap-3">
    <Text variant="h4">{title}</Text>
    {children}
  </View>
)

const ComponentGalleryScreen = memo(() => {
  const navigation = useNavigation<GalleryNavigationProp>()
  const [checked, setChecked] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [bold, setBold] = useState(false)
  const [progress, setProgress] = useState(35)
  const [tab, setTab] = useState('preview')
  const [selectedOption, setSelectedOption] = useState<Option | undefined>()
  const [menuChecked, setMenuChecked] = useState(true)
  const [gachaResult, setGachaResult] = useState<string[]>([])

  const increaseProgress = useCallback(() => {
    setProgress((current) => (current >= 100 ? 0 : Math.min(current + 15, 100)))
  }, [])

  return (
    <SafeAreaView className="bg-background flex-1" edges={['top', 'bottom']}>
      <View className="border-border flex-row items-center gap-3 border-b px-5 py-3">
        <Button variant="ghost" size="sm" onPress={() => navigation.goBack()}>
          <Text>Back</Text>
        </Button>
        <View className="flex-1">
          <Text variant="large">Development gallery</Text>
          <Text variant="muted">Only available in development builds</Text>
        </View>
      </View>

      <ScrollView
        contentContainerClassName="gap-8 p-5 pb-16"
        keyboardShouldPersistTaps="handled"
      >
        <Section title="Special components">
          <GachaSlider onResult={setGachaResult} />
          {gachaResult.length > 0 ? (
            <Text
              variant="muted"
              className="text-center"
              accessibilityLiveRegion="polite"
            >
              Last draw: {gachaResult.join(' · ')}
            </Text>
          ) : null}
        </Section>

        <Separator />

        <Section title="Typography">
          <Text variant="h1">Heading one</Text>
          <Text variant="h2">Heading two</Text>
          <Text variant="h3">Heading three</Text>
          <Text variant="h4">Heading four</Text>
          <Text variant="lead">Lead text for a prominent introduction.</Text>
          <Text>Default body copy shows the standard reading style.</Text>
          <Text variant="small">Small label text</Text>
          <Text variant="muted">Muted supporting text</Text>
          <Text variant="code">npm run start</Text>
        </Section>

        <Section title="Buttons">
          <View className="flex-row flex-wrap gap-2">
            {(
              ['default', 'secondary', 'outline', 'ghost', 'destructive', 'link'] as const
            ).map((variant) => (
              <Button key={variant} variant={variant} size="sm">
                <Text>{variant}</Text>
              </Button>
            ))}
            <Button size="icon" accessibilityLabel="Settings">
              <Icon as={Settings} />
            </Button>
            <Button disabled>
              <Text>Disabled</Text>
            </Button>
          </View>
        </Section>

        <Section title="Badges and icon">
          <View className="flex-row flex-wrap items-center gap-2">
            {(['default', 'secondary', 'outline', 'destructive'] as const).map(
              (variant) => (
                <Badge key={variant} variant={variant}>
                  <Text>{variant}</Text>
                </Badge>
              )
            )}
            <Icon as={Sparkles} className="text-primary" size={24} />
          </View>
        </Section>

        <Section title="Card">
          <Card>
            <CardHeader>
              <CardTitle>Component card</CardTitle>
              <CardDescription>
                Cards group related information and actions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Text>This is the content area.</Text>
            </CardContent>
            <CardFooter>
              <Button size="sm">
                <Text>Action</Text>
              </Button>
            </CardFooter>
          </Card>
        </Section>

        <Section title="Alerts">
          <Alert icon={Info}>
            <AlertTitle>Heads up</AlertTitle>
            <AlertDescription>This is a standard informational alert.</AlertDescription>
          </Alert>
          <Alert icon={TriangleAlert} variant="destructive">
            <AlertTitle>Something needs attention</AlertTitle>
            <AlertDescription>
              This shows the destructive alert treatment.
            </AlertDescription>
          </Alert>
        </Section>

        <Section title="Form controls">
          <View className="gap-2">
            <Label nativeID="gallery-name">Display name</Label>
            <Input aria-labelledby="gallery-name" placeholder="Type a name…" />
          </View>
          <View className="flex-row items-center gap-3">
            <Checkbox
              checked={checked}
              onCheckedChange={setChecked}
              id="gallery-checkbox"
            />
            <Label
              nativeID="gallery-checkbox-label"
              onPress={() => setChecked((value) => !value)}
            >
              Remember this choice
            </Label>
          </View>
          <View className="flex-row items-center justify-between">
            <Label nativeID="gallery-notifications">Notifications</Label>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </View>
          <Toggle pressed={bold} onPressedChange={setBold} variant="outline">
            <ToggleIcon as={Bold} />
            <Text>Bold</Text>
          </Toggle>
        </Section>

        <Section title="Select">
          <Select value={selectedOption} onValueChange={setSelectedOption}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a rarity" />
            </SelectTrigger>
            <SelectContent>
              <SelectLabel>Rarity</SelectLabel>
              <SelectItem label="Common" value="common" />
              <SelectItem label="Rare" value="rare" />
              <SelectItem label="Legendary" value="legendary" />
            </SelectContent>
          </Select>
        </Section>

        <Section title="Progress and loading">
          <Progress value={progress} />
          <View className="flex-row items-center justify-between">
            <Text variant="muted">{progress}% complete</Text>
            <Button size="sm" variant="outline" onPress={increaseProgress}>
              <Text>Advance</Text>
            </Button>
          </View>
          <View className="gap-2">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </View>
        </Section>

        <Section title="Tabs">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="preview">
                <Text>Preview</Text>
              </TabsTrigger>
              <TabsTrigger value="code">
                <Text>Code</Text>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="preview" className="border-border rounded-md border p-4">
              <Text>The rendered component preview goes here.</Text>
            </TabsContent>
            <TabsContent value="code" className="border-border rounded-md border p-4">
              <Text variant="code">{'<Component />'}</Text>
            </TabsContent>
          </Tabs>
        </Section>

        <Section title="Overlays and menus">
          <View className="flex-row flex-wrap gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Text>Open dialog</Text>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Example dialog</DialogTitle>
                  <DialogDescription>
                    Dialog behavior and spacing can be reviewed here.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button>
                      <Text>Done</Text>
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <Text>Open popover</Text>
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Text variant="large">Popover</Text>
                <Text variant="muted">Compact contextual content appears here.</Text>
              </PopoverContent>
            </Popover>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Icon as={Bell} />
                  <Text>Open menu</Text>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Text>View details</Text>
                </DropdownMenuItem>
                <DropdownMenuCheckboxItem
                  checked={menuChecked}
                  onCheckedChange={setMenuChecked}
                >
                  <Text>Show notifications</Text>
                </DropdownMenuCheckboxItem>
                <DropdownMenuItem variant="destructive">
                  <Text>Delete item</Text>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </View>
        </Section>
      </ScrollView>
    </SafeAreaView>
  )
})

ComponentGalleryScreen.displayName = 'ComponentGalleryScreen'

export default ComponentGalleryScreen
